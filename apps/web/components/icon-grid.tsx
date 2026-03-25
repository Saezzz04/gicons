'use client';

import { useState, useMemo } from 'react';
import { IconCard } from './icon-card';
import { SearchBar } from './search-bar';
import { CategoryFilter } from './category-filter';

interface BrandData {
  name: string;
  slug: string;
  category: string;
  tags: string[];
  primaryColor: string;
  variantCount: number;
  previewSvg: string;
}

interface IconGridProps {
  brands: BrandData[];
}

export function IconGrid({ brands }: IconGridProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(
    () => [...new Set(brands.map((b) => b.category))].sort(),
    [brands],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return brands.filter((b) => {
      if (category && b.category !== category) return false;
      if (!q) return true;
      return (
        b.name.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [brands, search, category]);

  return (
    <div className="space-y-6" aria-label="Search and filter icons">
      <SearchBar value={search} onChange={setSearch} />
      <CategoryFilter categories={categories} selected={category} onSelect={setCategory} />
      <div aria-live="polite" role="region" aria-label="Search results">
        <p className="sr-only">{filtered.length} icon{filtered.length !== 1 ? 's' : ''} found</p>
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-gray-500">No icons found matching your search.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filtered.map((brand) => (
              <IconCard
                key={brand.slug}
                name={brand.name}
                slug={brand.slug}
                svgHtml={brand.previewSvg}
                variantCount={brand.variantCount}
                category={brand.category}
                primaryColor={brand.primaryColor}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
