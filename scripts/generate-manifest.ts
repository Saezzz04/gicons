import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { BrandMeta } from '../packages/shared/src/types';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BRANDS_DIR = join(ROOT, 'packages/svg/src/brands');
const OUTPUT = join(ROOT, 'packages/shared/src/manifest.ts');

const brands: BrandMeta[] = [];

for (const entry of readdirSync(BRANDS_DIR)) {
  const brandDir = join(BRANDS_DIR, entry);
  if (!statSync(brandDir).isDirectory()) continue;

  const metaPath = join(brandDir, 'meta.json');
  try {
    const meta: BrandMeta = JSON.parse(readFileSync(metaPath, 'utf-8'));
    brands.push(meta);
    console.log(`  ✓ ${meta.name} (${meta.variants.length} variants)`);
  } catch {
    console.warn(`  ⚠ Skipping ${entry}: no valid meta.json`);
  }
}

brands.sort((a, b) => a.slug.localeCompare(b.slug));

const output = `// Auto-generated — do not edit manually
import type { BrandMeta } from './types';

export const manifest: BrandMeta[] = ${JSON.stringify(brands, null, 2)};
`;

writeFileSync(OUTPUT, output, 'utf-8');
console.log(`\nManifest generated with ${brands.length} brand(s)`);
