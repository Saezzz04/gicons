import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export interface IconVariant {
  file: string;
  type: 'logo' | 'wordmark' | 'mark' | 'icon';
  variant: string;
  background: 'light' | 'dark';
}

export interface BrandMeta {
  name: string;
  slug: string;
  category: string;
  tags: string[];
  website: string;
  colors: {
    primary: string;
    secondary?: string;
  };
  license: string;
  variants: IconVariant[];
}

const BRANDS_DIR = join(process.cwd(), '../../packages/svg/src/brands');
const DIST_DIR = join(process.cwd(), '../../packages/svg/dist/brands');

export function getAllBrands(): BrandMeta[] {
  if (!existsSync(BRANDS_DIR)) return [];

  const brands: BrandMeta[] = [];
  for (const entry of readdirSync(BRANDS_DIR)) {
    const brandDir = join(BRANDS_DIR, entry);
    if (!statSync(brandDir).isDirectory()) continue;

    const metaPath = join(brandDir, 'meta.json');
    if (!existsSync(metaPath)) continue;

    brands.push(JSON.parse(readFileSync(metaPath, 'utf-8')));
  }
  return brands.sort((a, b) => a.slug.localeCompare(b.slug));
}

export function getBrand(slug: string): BrandMeta | null {
  const metaPath = join(BRANDS_DIR, slug, 'meta.json');
  if (!existsSync(metaPath)) return null;
  return JSON.parse(readFileSync(metaPath, 'utf-8'));
}

export function getSvgContent(brandSlug: string, filename: string): string {
  const svgPath = join(DIST_DIR, brandSlug, filename);
  if (!existsSync(svgPath)) return '';
  return readFileSync(svgPath, 'utf-8');
}
