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
const REACT_SRC = join(ROOT, 'packages/react/src');
const TEMPLATE_PATH = join(ROOT, 'scripts/templates/react.hbs');

const template = Handlebars.compile(readFileSync(TEMPLATE_PATH, 'utf-8'));

mkdirSync(REACT_SRC, { recursive: true });

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

    // Convert SVG content to JSX (basic transforms)
    const jsxContent = content
      .replace(/class="/g, 'className="')
      .replace(/clip-path="/g, 'clipPath="')
      .replace(/fill-rule="/g, 'fillRule="')
      .replace(/clip-rule="/g, 'clipRule="')
      .replace(/stroke-width="/g, 'strokeWidth="')
      .replace(/stroke-linecap="/g, 'strokeLinecap="')
      .replace(/stroke-linejoin="/g, 'strokeLinejoin="')
      .replace(/fill-opacity="/g, 'fillOpacity="')
      .replace(/stroke-opacity="/g, 'strokeOpacity="')
      .replace(/stop-color="/g, 'stopColor="')
      .replace(/stop-opacity="/g, 'stopOpacity="');

    const code = template({
      componentName,
      viewBox,
      svgContent: jsxContent,
    });

    const outPath = join(REACT_SRC, `${componentName}.tsx`);
    writeFileSync(outPath, code, 'utf-8');
    exports.push(`export { default as ${componentName} } from './${componentName}';`);
    console.log(`  ✓ ${componentName}`);
  }
}

// Write barrel index
const indexContent = `// Auto-generated — do not edit manually\n${exports.join('\n')}\n`;
writeFileSync(join(REACT_SRC, 'index.ts'), indexContent, 'utf-8');
console.log(`\nGenerated ${exports.length} React component(s)`);
