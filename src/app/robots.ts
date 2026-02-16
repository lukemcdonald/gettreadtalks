import type { MetadataRoute } from 'next';

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
    sitemap: 'https://gettreadtalks.com/sitemap.xml',
  };
}
