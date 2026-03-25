import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { optimize } from 'svgo';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = join(ROOT, 'packages/svg/src/brands');
const DIST = join(ROOT, 'packages/svg/dist/brands');

const svgoConfig = {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: { overrides: { removeViewBox: false } },
    },
    'removeDimensions',
    'removeXMLNS',
    { name: 'sortAttrs' },
  ],
};

function processDirectory(srcDir: string, distDir: string) {
  mkdirSync(distDir, { recursive: true });

  for (const entry of readdirSync(srcDir)) {
    const srcPath = join(srcDir, entry);
    const distPath = join(distDir, entry);
    const stat = statSync(srcPath);

    if (stat.isDirectory()) {
      processDirectory(srcPath, distPath);
    } else if (entry.endsWith('.svg')) {
      const raw = readFileSync(srcPath, 'utf-8');
      const result = optimize(raw, svgoConfig);
      writeFileSync(distPath, result.data, 'utf-8');
      console.log(`  ✓ ${entry}`);
    }
  }
}

console.log('Building SVGs...\n');
processDirectory(SRC, DIST);
console.log('\nDone!');
