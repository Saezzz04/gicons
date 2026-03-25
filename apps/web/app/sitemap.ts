import type { MetadataRoute } from 'next';
import { getAllBrands } from '@/lib/icons';

const BASE_URL = 'https://gicons.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  const brands = getAllBrands();

  const brandPages = brands.map((brand) => ({
    url: `${BASE_URL}/icons/${brand.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...brandPages,
  ];
}
