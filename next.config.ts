import type { NextConfig } from 'next';

import { withSentryConfig } from '@sentry/nextjs';

import { IS_SENTRY_ENABLED } from './src/configs/sentry';

const cspHeader = `
  base-uri 'self';
  connect-src 'self' https://*.convex.cloud wss://*.convex.cloud https://*.sentry.io https://*.ingest.us.sentry.io;
  default-src 'self';
  font-src 'self' data:;
  form-action 'self';
  frame-ancestors 'none';
  frame-src 'self' https://vercel.live https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com;
  img-src 'self' blob: data: https:;
  object-src 'none';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live;
  style-src 'self' 'unsafe-inline';
  worker-src 'self' blob:;
  upgrade-insecure-requests;
`;

const nextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        hostname: 'gravatar.com',
        protocol: 'https',
      },
      {
        hostname: 'vumbnail.com',
        protocol: 'https',
      },
      {
        hostname: 'i.ytimg.com',
        protocol: 'https',
      },
    ],
  },
  typedRoutes: false,
  headers: async () => [
    {
      headers: [
        {
          key: 'Content-Security-Policy',
          value: cspHeader.replace(/\n/g, ''),
        },
      ],
      source: '/(.*)',
    },
  ],
} satisfies NextConfig;

const config = IS_SENTRY_ENABLED
  ? withSentryConfig(nextConfig, {
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      silent: !process.env.CI,
      sourcemaps: {
        disable: true,
      },
      release: {
        create: false,
      },
    })
  : nextConfig;

export default config;
