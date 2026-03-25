import { streamText, tool } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { validateSvg, optimizeSvg } from '@/lib/svg-validator';
import { searchBrandAssets, downloadSvg } from '@/lib/brand-search';
import { braveWebSearch } from '@/lib/web-search';
import { createBranchFromMain, commitFiles, createPR } from '@/lib/github';

const BRANDS_DIR = join(process.cwd(), '../../packages/svg/src/brands');

const SYSTEM_PROMPT = `You are the gicons brand icon assistant. You help users find and add brand logos to the gicons icon library.

When a user asks for a brand icon:
1. First check if it already exists using check_existing_brand
2. Use web_search to find the brand's official website and press/brand assets page
   - Try a query like "{brand name} brand assets SVG download" or "{brand name} press kit logo"
   - If the first search doesn't find useful results, try different search terms
   - Look for results from the brand's official domain or GitHub
3. Use search_brand_assets to scrape SVG links from the URLs you found via web search
   - Pass the brand's domain (e.g., "supabase.com") to search their common brand/press pages
4. Download and validate each SVG using download_and_validate_svg
5. Show the user what you found and ask for confirmation
6. Create a GitHub PR using create_brand_pr

Tips for effective web searching:
- Include "SVG" or "brand assets" or "press kit" in your search query
- If a brand is well-known, try "{brand} logo SVG download" first
- Look for results from the brand's official domain, GitHub, or recognized design resource sites
- If web_search returns a direct link to an SVG file, you can pass it directly to download_and_validate_svg

Naming conventions:
- Brand directories: kebab-case (e.g., "supabase", "visual-studio-code")
- SVG files: {type}-{variant}.svg where type is logo/wordmark/mark/icon and variant is color/white/dark/monochrome
- Categories: payments, social, devtools, cloud, design, communication, productivity, other

Be concise and helpful. Always validate SVGs before creating a PR.`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-2.0-flash'),
    system: SYSTEM_PROMPT,
    messages,
    maxSteps: 15,
    tools: {
      check_existing_brand: tool({
        description: 'Check if a brand already exists in the gicons library',
        parameters: z.object({
          slug: z.string().describe('Brand slug in kebab-case'),
        }),
        execute: async ({ slug }) => {
          const metaPath = join(BRANDS_DIR, slug, 'meta.json');
          const exists = existsSync(metaPath);
          return { exists, slug };
        },
      }),

      web_search: tool({
        description:
          'Search the web using Brave Search. Use this to find a brand\'s official website, press kit, or brand assets page. Call this before search_brand_assets to discover the right URLs to scrape.',
        parameters: z.object({
          query: z
            .string()
            .describe(
              'Search query. Include the brand name and terms like "brand assets", "press kit", "logo SVG", or "media kit".',
            ),
        }),
        execute: async ({ query }) => {
          try {
            const results = await braveWebSearch(query, 5);
            return { query, results, count: results.length };
          } catch (err) {
            return { query, results: [], count: 0, error: String(err) };
          }
        },
      }),

      search_brand_assets: tool({
        description: 'Search for official SVG brand assets on a brand website',
        parameters: z.object({
          brandName: z.string().describe('Brand name'),
          domain: z.string().optional().describe('Brand website domain (e.g., supabase.com)'),
        }),
        execute: async ({ brandName, domain }) => {
          const result = await searchBrandAssets(brandName, domain);
          return {
            brandName,
            urls: result.urls.slice(0, 10),
            source: result.source,
            count: result.urls.length,
          };
        },
      }),

      download_and_validate_svg: tool({
        description: 'Download an SVG from a URL, validate it, and optimize it',
        parameters: z.object({
          url: z.string().describe('URL to download SVG from'),
          suggestedFilename: z.string().describe('Suggested filename (e.g., logo-color.svg)'),
        }),
        execute: async ({ url, suggestedFilename }) => {
          const { content, ok, error } = await downloadSvg(url);
          if (!ok) return { valid: false, error, filename: suggestedFilename };

          const validation = validateSvg(content);
          if (!validation.valid) {
            return { valid: false, errors: validation.errors, filename: suggestedFilename };
          }

          const optimized = optimizeSvg(content);
          const viewBoxMatch = optimized.match(/viewBox="([^"]+)"/);

          return {
            valid: true,
            filename: suggestedFilename,
            svgContent: optimized,
            viewBox: viewBoxMatch?.[1] ?? 'unknown',
            originalSize: content.length,
            optimizedSize: optimized.length,
          };
        },
      }),

      create_brand_pr: tool({
        description: 'Create a GitHub PR to add a new brand to gicons',
        parameters: z.object({
          brandName: z.string(),
          slug: z.string(),
          category: z.enum([
            'payments', 'social', 'devtools', 'cloud', 'design',
            'communication', 'productivity', 'other',
          ]),
          tags: z.array(z.string()),
          website: z.string(),
          primaryColor: z.string(),
          variants: z.array(z.object({
            filename: z.string(),
            svgContent: z.string(),
            type: z.enum(['logo', 'wordmark', 'mark', 'icon']),
            variant: z.string(),
            background: z.enum(['light', 'dark']),
          })),
        }),
        execute: async ({ brandName, slug, category, tags, website, primaryColor, variants }) => {
          try {
            const branchName = `add-${slug}`;
            await createBranchFromMain(branchName);

            const metaJson = {
              name: brandName,
              slug,
              category,
              tags,
              website,
              colors: { primary: primaryColor },
              license: 'trademark',
              variants: variants.map((v) => ({
                file: v.filename,
                type: v.type,
                variant: v.variant,
                background: v.background,
              })),
            };

            const files = [
              {
                path: `packages/svg/src/brands/${slug}/meta.json`,
                content: JSON.stringify(metaJson, null, 2),
              },
              ...variants.map((v) => ({
                path: `packages/svg/src/brands/${slug}/${v.filename}`,
                content: v.svgContent,
              })),
            ];

            await commitFiles(branchName, files, `feat: add ${brandName} brand icons`);
            const pr = await createPR(
              branchName,
              `Add ${brandName} brand icons`,
              `## New Brand: ${brandName}\n\n` +
              `- Category: ${category}\n` +
              `- Website: ${website}\n` +
              `- Variants: ${variants.length}\n\n` +
              `| File | Type | Variant | Background |\n` +
              `|------|------|---------|------------|\n` +
              variants.map((v) => `| ${v.filename} | ${v.type} | ${v.variant} | ${v.background} |`).join('\n') +
              `\n\n---\nCreated via gicons AI assistant`,
            );

            return { success: true, prUrl: pr.url, prNumber: pr.number };
          } catch (err) {
            return { success: false, error: String(err) };
          }
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
