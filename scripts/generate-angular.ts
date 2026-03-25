import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Handlebars from 'handlebars';
import { parseSvg } from './utils/svg-parser';
import { fileToComponentName, fileToTagName } from './utils/naming';
import type { BrandMeta } from '../packages/shared/src/types';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DIST_SVG = join(ROOT, 'packages/svg/dist/brands');
const BRANDS_SRC = join(ROOT, 'packages/svg/src/brands');
const ANGULAR_SRC = join(ROOT, 'packages/angular/src');
const TEMPLATE_PATH = join(ROOT, 'scripts/templates/angular.hbs');

const template = Handlebars.compile(readFileSync(TEMPLATE_PATH, 'utf-8'));

mkdirSync(ANGULAR_SRC, { recursive: true });

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
    const tagName = fileToTagName(meta.slug, variant.file);

    const code = template({ componentName, tagName, viewBox, svgContent: content });

    const outPath = join(ANGULAR_SRC, `${componentName}.ts`);
    writeFileSync(outPath, code, 'utf-8');
    exports.push(componentName);
    console.log(`  ✓ ${componentName}`);
  }
}

const indexContent = `// Auto-generated — do not edit manually\n${exports.map((n) => `export { ${n} } from './${n}';`).join('\n')}\n`;
writeFileSync(join(ANGULAR_SRC, 'index.ts'), indexContent, 'utf-8');
console.log(`\nGenerated ${exports.length} Angular component(s)`);
