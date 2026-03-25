import { getAllBrands, getSvgContent } from '@/lib/icons';
import { IconGrid } from '@/components/icon-grid';
import { InstallTabs } from '@/components/install-tabs';

export default function HomePage() {
  const brands = getAllBrands();

  const brandData = brands.map((brand) => {
    const firstVariant = brand.variants[0];
    const previewSvg = firstVariant
      ? getSvgContent(brand.slug, firstVariant.file).replace(
          '<svg',
          '<svg style="width:100%;height:100%;max-height:64px"',
        )
      : '';

    return {
      name: brand.name,
      slug: brand.slug,
      category: brand.category,
      tags: brand.tags,
      primaryColor: brand.colors.primary,
      variantCount: brand.variants.length,
      previewSvg,
    };
  });

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Brand Icons',
    numberOfItems: brands.length,
    itemListElement: brands.map((brand, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: brand.name,
      url: `https://gicons.dev/icons/${brand.slug}`,
    })),
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Brand icons for every framework
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Open-source brand logos as components for React, Vue, Svelte, Angular, and Web Components.
          <br />
          Tree-shakeable, typed, and ready to use.
        </p>
        <div className="mx-auto mt-6 max-w-md">
          <InstallTabs packageName="@gicons/react" />
        </div>
      </div>

      <IconGrid brands={brandData} />

      <section className="mt-20 grid gap-8 sm:grid-cols-3">
        <div>
          <h3 className="font-semibold">Tree-shakeable</h3>
          <p className="mt-1 text-sm text-gray-600">
            Only the icons you import are included in your bundle.
          </p>
        </div>
        <div>
          <h3 className="font-semibold">TypeScript first</h3>
          <p className="mt-1 text-sm text-gray-600">
            Full type definitions with proper SVG props for every framework.
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Every framework</h3>
          <p className="mt-1 text-sm text-gray-600">
            React, Vue, Svelte, Angular, Web Components, or raw SVG.
          </p>
        </div>
      </section>
    </div>
  );
}
