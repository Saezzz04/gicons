import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Handlebars from 'handlebars';
import { parseSvg } from './utils/svg-parser';
import { fileToComponentName } from './utils/naming';
import type { BrandMeta } from '../packages/shared/src/types';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DIST_SVG = join(ROOT, 'packages/svg/dist/brands');
const BRANDS_SRC = join(ROOT, 'packages/svg/src/brands');
const SVELTE_SRC = join(ROOT, 'packages/svelte/src');
const TEMPLATE_PATH = join(ROOT, 'scripts/templates/svelte.hbs');

const template = Handlebars.compile(readFileSync(TEMPLATE_PATH, 'utf-8'));

mkdirSync(SVELTE_SRC, { recursive: true });

const exports: string[] = [];

for (const brandDir of readdirSync(BRANDS_SRC)) {
  const brandPath = join(BRANDS_SRC, brandDir);
  if (!statSync(brandPath).isDirectory()) continue;

  const metaPath = join(brandPath, 'meta.json');
  if (!existsSync(metaPath)) continue;

  const meta: BrandMeta = JSON.parse(readFileSync(metaPath, 'utf-8'));

  for (const variant of meta.variants) {
    const svgPath = join(DIST_SVG, meta.slug, variant.file);
    if (!existsSync(svgPath)) {
      console.warn(`  ⚠ SVG not found: ${svgPath}`);
      continue;
    }

    const svgString = readFileSync(svgPath, 'utf-8');
    const { viewBox, content } = parseSvg(svgString);
    const componentName = fileToComponentName(meta.slug, variant.file);

    const code = template({ componentName, viewBox, svgContent: content });

    const outPath = join(SVELTE_SRC, `${componentName}.svelte`);
    writeFileSync(outPath, code, 'utf-8');
    exports.push(componentName);
    console.log(`  ✓ ${componentName}`);
  }
}

const indexContent = `// Auto-generated — do not edit manually\n${exports.map((n) => `export { default as ${n} } from './${n}.svelte';`).join('\n')}\n`;
writeFileSync(join(SVELTE_SRC, 'index.ts'), indexContent, 'utf-8');
console.log(`\nGenerated ${exports.length} Svelte component(s)`);
