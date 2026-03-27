import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = join(ROOT, 'packages/svg/src/brands');
const DIST = join(ROOT, 'packages/svg/dist/brands');

interface BrandMeta {
  name: string;
  slug: string;
  website: string;
}

const FAVICON_SIZES = [16, 32, 64, 128, 256];

function getDomain(websiteUrl: string): string {
  try {
    return new URL(websiteUrl).hostname;
  } catch {
    return websiteUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  }
}

async function fetchFavicon(domain: string, size: number): Promise<Buffer | null> {
  const url = `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    // Google returns a default globe icon (very small) when no favicon found — skip if < 200 bytes for large sizes
    if (size >= 64 && buffer.length < 200) return null;
    return buffer;
  } catch {
    return null;
  }
}

async function fetchDirectFavicon(websiteUrl: string): Promise<Buffer | null> {
  try {
    const url = new URL('/favicon.ico', websiteUrl).href;
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type') ?? '';
    if (!contentType.includes('image') && !contentType.includes('octet-stream')) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}

async function buildFavicons(meta: BrandMeta) {
  const domain = getDomain(meta.website);
  const faviconDir = join(DIST, meta.slug, 'favicons');
  if (existsSync(faviconDir)) rmSync(faviconDir, { recursive: true });
  mkdirSync(faviconDir, { recursive: true });

  let downloaded = 0;

  for (const size of FAVICON_SIZES) {
    const buffer = await fetchFavicon(domain, size);
    if (buffer) {
      writeFileSync(join(faviconDir, `favicon-${size}x${size}.png`), buffer);
      downloaded++;
    }
  }

  // Fallback: download favicon.ico directly if Google API returned nothing
  if (downloaded === 0) {
    const ico = await fetchDirectFavicon(meta.website);
    if (ico) {
      writeFileSync(join(faviconDir, 'favicon.ico'), ico);
      console.log(`  ⚠ ${meta.name} (favicon.ico fallback from ${domain})`);
      return;
    }
    console.log(`  ✗ ${meta.name} (no favicon found for ${domain})`);
    return;
  }

  console.log(`  ✓ ${meta.name} (${downloaded} sizes from ${domain})`);
}

async function main() {
  console.log('Fetching favicons from brand domains...\n');

  let count = 0;
  for (const entry of readdirSync(SRC)) {
    const brandDir = join(SRC, entry);
    if (!statSync(brandDir).isDirectory()) continue;

    const metaPath = join(brandDir, 'meta.json');
    if (!existsSync(metaPath)) continue;

    const meta: BrandMeta = JSON.parse(readFileSync(metaPath, 'utf-8'));
    await buildFavicons(meta);
    count++;
  }

  console.log(`\nProcessed ${count} brand(s)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
