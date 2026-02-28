import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/constants/env';

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
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
