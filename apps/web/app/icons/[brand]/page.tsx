import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllBrands, getBrand, getSvgContent, getFaviconFiles, getFaviconBase64 } from '@/lib/icons';
import { CodeSnippet } from '@/components/code-snippet';
import { DownloadButton } from '@/components/download-button';
import { FaviconDownloadButton } from '@/components/favicon-download-button';

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

      {(() => {
        const faviconFiles = getFaviconFiles(brand.slug);
        if (faviconFiles.length === 0) return null;

        const sizeMap: Record<string, string> = {
          'favicon-16x16.png': '16x16',
          'favicon-32x32.png': '32x32',
          'favicon-64x64.png': '64x64',
          'favicon-128x128.png': '128x128',
          'favicon-256x256.png': '256x256',
          'favicon.ico': 'ICO',
        };

        return (
          <section className="mt-10 rounded-xl border border-gray-200 p-6">
            <h2 className="mb-2 text-lg font-semibold">Favicons</h2>
            <p className="mb-4 text-sm text-gray-500">
              Official favicons from {brand.website}. Click to download.
            </p>
            <div className="mb-6 flex flex-wrap gap-3">
              {faviconFiles.map((file) => (
                <FaviconDownloadButton
                  key={file}
                  filename={`${brand.slug}-${file}`}
                  base64={getFaviconBase64(brand.slug, file)}
                  size={sizeMap[file] ?? file}
                />
              ))}
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="mb-2 text-xs font-medium text-gray-700">Add to your HTML head:</p>
              <pre className="overflow-x-auto text-xs text-gray-600">
{`<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="128x128" href="/favicon-128x128.png">`}
              </pre>
            </div>
          </section>
        );
      })()}
    </div>
  );
}
