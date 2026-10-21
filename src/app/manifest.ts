import type { MetadataRoute } from 'next';

import { site } from '@/configs/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: site.themeColor.light,
    description: site.description,
    display: 'standalone',
    icons: [
      {
        sizes: '192x192',
        src: '/icons/icon-192.png',
        type: 'image/png',
      },
      {
        sizes: '512x512',
        src: '/icons/icon-512.png',
        type: 'image/png',
      },
      {
        purpose: 'maskable',
        sizes: '512x512',
        src: '/icons/icon-512-maskable.png',
        type: 'image/png',
      },
    ],
    name: site.name,
    short_name: site.name,
    start_url: '/',
    theme_color: site.themeColor.light,
  };
}
