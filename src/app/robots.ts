import type { MetadataRoute } from 'next';

import { site } from '@/configs/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      allow: '/',
      disallow: [
        '/account',
        '/forgot-password',
        '/login',
        '/logout',
        '/register',
        '/reset-password',
        '/*/edit',
        '/*/new',
      ],
      userAgent: '*',
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
