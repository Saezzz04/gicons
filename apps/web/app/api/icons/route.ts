import { NextResponse } from 'next/server';
import { getAllBrands } from '@/lib/icons';

function kebabToPascal(str: string): string {
  return str
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

export async function GET() {
  const brands = getAllBrands().map((brand) => ({
    name: brand.name,
    slug: brand.slug,
    category: brand.category,
    tags: brand.tags,
    website: brand.website,
    colors: brand.colors,
    variants: brand.variants.map((v) => {
      const base = v.file.replace('.svg', '');
      const componentName = kebabToPascal(brand.slug) + kebabToPascal(base);
      const tagName = `${brand.slug}-${base}`;
      return {
        ...v,
        componentName,
        tagName,
      };
    }),
  }));

  return NextResponse.json(
    {
      brands,
      count: brands.length,
      packages: {
        react: '@gicons/react',
        vue: '@gicons/vue',
        svelte: '@gicons/svelte',
        angular: '@gicons/angular',
        web: '@gicons/web',
        svg: '@gicons/svg',
      },
      install: {
        npm: 'npm install @gicons/{framework}',
        pnpm: 'pnpm add @gicons/{framework}',
        yarn: 'yarn add @gicons/{framework}',
        bun: 'bun add @gicons/{framework}',
      },
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    },
  );
}
