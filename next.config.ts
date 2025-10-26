import type { NextConfig } from 'next';

import { withSentryConfig } from '@sentry/nextjs';

import { IS_SENTRY_ENABLED } from './lib/config/sentry';
import { IS_PROD } from '@/lib/constants/env';

const cspHeader = `
  base-uri 'self';
  connect-src 'self' https://*.convex.cloud wss://*.convex.cloud https://*.sentry.io https://*.ingest.us.sentry.io;
  default-src 'self';
  font-src 'self' data:;
  form-action 'self';
  frame-ancestors 'none';
  frame-src 'self';
  img-src 'self' blob: data: https:;
  object-src 'none';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live;
  style-src 'self' 'unsafe-inline';
  worker-src 'self' blob:;
  upgrade-insecure-requests;
`;

const nextConfig = {
  cacheComponents: true,
  typedRoutes: true,
  headers: async () => {
    return [
      {
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
        ],
        source: '/(.*)',
      },
    ];
  },
} satisfies NextConfig;

// Wrap with Sentry configuration if Sentry is enabled
const config = IS_SENTRY_ENABLED
  ? withSentryConfig(nextConfig, {
      // For all available options, see:
      // https://www.npmjs.com/package/@sentry/webpack-plugin#options
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,

      // Only print logs for uploading source maps in CI
      silent: !process.env.CI,

      // Upload a larger set of source maps for prettier stack traces (increases build time)
      widenClientFileUpload: true,

      // Automatically tree-shake Sentry logger statements to reduce bundle size
      disableLogger: IS_PROD,

      // Enables automatic instrumentation of Vercel Cron Monitors
      automaticVercelMonitors: true,

      // Enhanced source map configuration for better debugging
      // See: https://docs.sentry.io/platforms/javascript/guides/nextjs/sourcemaps/
      sourcemaps: {
        disable: false, // Source maps are enabled by default
        assets: [
          "**/*.js", 
          "**/*.js.map",
        ],
        ignore: [
          "**/node_modules/**",
          "**/.next/static/chunks/**", // Exclude Next.js chunks
        ],
        deleteSourcemapsAfterUpload: true, // Security: delete after upload
      },

      // Application key for third-party error filtering
      // This marks your application code so it can be distinguished from third-party code
      unstable_sentryWebpackPluginOptions: {
        applicationKey: "gettreadtalks-app",
      },
    })
  : nextConfig;

export default config;
