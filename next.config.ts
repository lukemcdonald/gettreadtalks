import type { NextConfig } from 'next';

import { withSentryConfig } from '@sentry/nextjs/config';
import path from 'node:path';

import { IS_SENTRY_ENABLED } from './src/configs/sentry';

const SENTRY_CLIENT_EXCLUDE_TRACING_LOADER = path.join(
  import.meta.dirname,
  'scripts/sentry-client-exclude-tracing.cjs'
);

const cspHeader = `
  base-uri 'self';
  connect-src 'self' https://*.convex.cloud wss://*.convex.cloud https://api.segment.com https://api.segment.io https://cdn.segment.com https://challenges.cloudflare.com https://*.sentry.io https://*.ingest.us.sentry.io https://va.vercel-scripts.com;
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
  upgrade-insecure-requests;
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
  turbopack: {
    rules: {
      '*': {
        condition: {
          all: ['browser', { path: /@sentry\//u }],
        },
        loaders: [SENTRY_CLIENT_EXCLUDE_TRACING_LOADER],
      },
    },
  },
  typedRoutes: false,
} satisfies NextConfig;

const config: NextConfig = IS_SENTRY_ENABLED
  ? withSentryConfig(nextConfig, {
      authToken: process.env.SENTRY_AUTH_TOKEN,
      bundleSizeOptimizations: {
        excludeTracing: true,
      },
      org: 'lukemcdonald',
      project: 'gettreadtalks',
      silent: !process.env.CI,
      sourcemaps: {
        deleteSourcemapsAfterUpload: true,
      },
      widenClientFileUpload: true,
    })
  : nextConfig;

// withSentryConfig sets compiler.define.__SENTRY_TRACING__ for every runtime.
// Next cannot override that key in defineServer, so keep tracing DCE client-only.
delete config.compiler?.define?.__SENTRY_TRACING__;

export default config;
