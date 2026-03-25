'use client';

import Link from 'next/link';

interface IconCardProps {
  name: string;
  slug: string;
  svgHtml: string;
  variantCount: number;
  category: string;
  primaryColor: string;
}

export function IconCard({ name, slug, svgHtml, variantCount, category, primaryColor }: IconCardProps) {
  return (
    <Link
      href={`/icons/${slug}`}
      className="group flex flex-col items-center rounded-xl border border-gray-200 p-6 transition-all hover:border-gray-300 hover:shadow-md"
    >
      <img
        role="img"
        alt={`${name} logo`}
        className="mb-4 h-16 w-full object-contain"
        src={`data:image/svg+xml;base64,${btoa(svgHtml)}`}
      />
      <h3 className="text-sm font-medium text-gray-900">{name}</h3>
      <div className="mt-1 flex items-center gap-2">
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{category}</span>
        <span className="text-xs text-gray-400">{variantCount} variant{variantCount !== 1 ? 's' : ''}</span>
      </div>
    </Link>
  );
}
