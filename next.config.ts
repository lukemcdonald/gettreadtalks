import type { NextConfig } from 'next';

import { withSentryConfig } from '@sentry/nextjs/config';

import { IS_SENTRY_ENABLED } from './src/configs/sentry';

const isDev = process.env.NODE_ENV === 'development';
const localConvexConnect = isDev
  ? ' http://127.0.0.1:3210 http://127.0.0.1:3211 http://localhost:3210 http://localhost:3211 ws://127.0.0.1:3210 ws://localhost:3210'
  : '';

const cspHeader = `
  base-uri 'self';
  connect-src 'self' https://*.convex.cloud wss://*.convex.cloud${localConvexConnect} https://api.segment.com https://api.segment.io https://cdn.segment.com https://challenges.cloudflare.com https://*.sentry.io https://*.ingest.us.sentry.io https://va.vercel-scripts.com;
  default-src 'self';
  font-src 'self' data:;
  form-action 'self';
  frame-ancestors 'none';
  frame-src 'self' https://challenges.cloudflare.com https://vercel.live https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com;
  img-src 'self' blob: data: https:;
  media-src 'self' https://*.sermonaudio.com;
  object-src 'none';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.segment.com https://challenges.cloudflare.com https://vercel.live https://va.vercel-scripts.com;
  style-src 'self' 'unsafe-inline';
  worker-src 'self' blob:;
  ${isDev ? '' : 'upgrade-insecure-requests;'}
`;

const nextConfig = {
  allowedDevOrigins: ['127.0.0.1'],
  cacheComponents: true,
  experimental: {
    turbopackRustReactCompiler: true,
  },
  headers: () => [
    {
      headers: [
        {
          key: 'Content-Security-Policy',
          value: cspHeader.replaceAll('\n', ''),
        },
      ],
      source: '/(.*)',
    },
  ],
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
      {
        hostname: 'img.youtube.com',
        protocol: 'https',
      },
    ],
  },
  partialPrefetching: true,
  reactCompiler: true,
  redirects: () => [
    {
      destination: '/manage/clips',
      permanent: true,
      source: '/account/clips',
    },
    {
      destination: '/manage/collections',
      permanent: true,
      source: '/account/collections',
    },
    {
      destination: '/manage/speakers',
      permanent: true,
      source: '/account/speakers',
    },
    {
      destination: '/manage/talks',
      permanent: true,
      source: '/account/talks',
    },
    {
      destination: '/manage/topics',
      permanent: true,
      source: '/account/topics',
    },
  ],
  typedRoutes: false,
} satisfies NextConfig;

const config = IS_SENTRY_ENABLED
  ? withSentryConfig(nextConfig, {
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: 'lukemcdonald',
      project: 'gettreadtalks',
      silent: !process.env.CI,
      sourcemaps: {
        deleteSourcemapsAfterUpload: true,
      },
      widenClientFileUpload: true,
    })
  : nextConfig;

export default config;
