import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllBrands, getBrand, getSvgContent } from '@/lib/icons';
import { CodeSnippet } from '@/components/code-snippet';
import { DownloadButton } from '@/components/download-button';

function fileToComponentName(brandSlug: string, filename: string): string {
  const base = filename.replace('.svg', '');
  const toPascal = (s: string) =>
    s
      .split('-')
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join('');
  return toPascal(brandSlug) + toPascal(base);
}

function fileToTagName(brandSlug: string, filename: string): string {
  return `${brandSlug}-${filename.replace('.svg', '')}`;
}

export async function generateStaticParams() {
  return getAllBrands().map((b) => ({ brand: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ brand: string }> }) {
  const { brand: slug } = await params;
  const brand = getBrand(slug);
  if (!brand) return {};
  return {
    title: `${brand.name} — gicons`,
    description: `${brand.name} brand icons for React, Vue, Svelte, Angular, and Web Components.`,
  };
}

export default async function BrandPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand: slug } = await params;
  const brand = getBrand(slug);
  if (!brand) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: `${brand.name} icons — gicons`,
    description: `${brand.name} brand icons for React, Vue, Svelte, Angular, and Web Components.`,
    codeRepository: 'https://github.com/gicons/gicons',
    programmingLanguage: ['TypeScript', 'React', 'Vue', 'Svelte', 'Angular'],
    license: 'https://opensource.org/licenses/MIT',
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link href="/" className="mb-6 inline-flex items-center text-sm text-gray-500 hover:text-gray-900">
        Back to all icons
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">{brand.name}</h1>
        <div className="mt-2 flex items-center gap-3">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm capitalize text-gray-600">
            {brand.category}
          </span>
          <a
            href={brand.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            {brand.website}
          </a>
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {brand.tags.map((tag) => (
            <span key={tag} className="rounded bg-gray-50 px-2 py-0.5 text-xs text-gray-500">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-10">
        {brand.variants.map((variant) => {
          const svgContent = getSvgContent(brand.slug, variant.file);
          const componentName = fileToComponentName(brand.slug, variant.file);
          const tagName = fileToTagName(brand.slug, variant.file);

          return (
            <section key={variant.file} className="rounded-xl border border-gray-200 p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold capitalize">
                    {variant.type} — {variant.variant}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Recommended on {variant.background} backgrounds
                  </p>
                </div>
                <DownloadButton svgContent={svgContent} filename={`${brand.slug}-${variant.file}`} />
              </div>

              <div
                className={`mb-6 flex items-center justify-center rounded-lg p-8 ${
                  variant.background === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
                }`}
              >
                <img
                  role="img"
                  alt={`${brand.name} ${variant.type} - ${variant.variant}`}
                  className="h-16"
                  src={`data:image/svg+xml;base64,${Buffer.from(svgContent.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg" style="height:100%;width:auto"')).toString('base64')}`}
                />
              </div>

              <CodeSnippet componentName={componentName} tagName={tagName} svgContent={svgContent} />
            </section>
          );
        })}
      </div>
    </div>
  );
}
