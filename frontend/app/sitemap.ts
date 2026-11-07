
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://project-mate-gamma.vercel.app';

  return [
    {
      url: baseUrl,
      lastModified: new Date('2026-11-07'),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date('2026-11-07'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date('2026-11-07'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}
