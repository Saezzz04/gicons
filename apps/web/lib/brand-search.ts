export interface BrandSearchResult {
  urls: string[];
  source: string;
}

const COMMON_PATHS = [
  '/brand',
  '/press',
  '/logos',
  '/brand-assets',
  '/media-kit',
  '/press-kit',
  '/about/brand',
];

async function tryFetchPage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'gicons-bot/1.0 (brand-icon-library)' },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type') ?? '';
    if (!contentType.includes('text/html') && !contentType.includes('text/plain')) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function extractSvgUrls(html: string, baseUrl: string): string[] {
  const svgPattern = /(?:href|src)=["']([^"']*\.svg)["']/gi;
  const urls: string[] = [];
  let match;

  while ((match = svgPattern.exec(html)) !== null) {
    let url = match[1];
    if (url.startsWith('//')) url = 'https:' + url;
    else if (url.startsWith('/')) url = new URL(url, baseUrl).toString();
    else if (!url.startsWith('http')) url = new URL(url, baseUrl).toString();
    urls.push(url);
  }

  return [...new Set(urls)];
}

export async function searchBrandAssets(brandName: string, domain?: string): Promise<BrandSearchResult> {
  const allUrls: string[] = [];
  let source = '';

  if (domain) {
    const baseUrl = domain.startsWith('http') ? domain : `https://${domain}`;

    for (const path of COMMON_PATHS) {
      const pageUrl = `${baseUrl}${path}`;
      const html = await tryFetchPage(pageUrl);
      if (html) {
        const svgUrls = extractSvgUrls(html, baseUrl);
        if (svgUrls.length > 0) {
          allUrls.push(...svgUrls);
          source = pageUrl;
          break;
        }
      }
    }
  }

  return { urls: allUrls, source };
}

export async function downloadSvg(url: string): Promise<{ content: string; ok: boolean; error?: string }> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'gicons-bot/1.0 (brand-icon-library)' },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return { content: '', ok: false, error: `HTTP ${res.status}` };
    }

    const content = await res.text();

    if (!content.includes('<svg')) {
      return { content: '', ok: false, error: 'Response is not an SVG' };
    }

    return { content, ok: true };
  } catch (err) {
    return { content: '', ok: false, error: String(err) };
  }
}
