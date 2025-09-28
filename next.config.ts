import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const cspHeader = `
  base-uri 'self';
  connect-src 'self' https://*.convex.cloud wss://*.convex.cloud;
  default-src 'self';
  font-src 'self' data:;
  form-action 'self';
  frame-ancestors 'none';
  frame-src 'self';
  img-src 'self' blob: data: https:;
  object-src 'none';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live;
  style-src 'self' 'unsafe-inline';
  upgrade-insecure-requests;
`;

const nextConfig: NextConfig = {
  experimental: {
    instrumentationHook: true,
  },
  headers: async () => {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
        ],
      },
    ];
  },
};

// Wrap with Sentry configuration if Sentry DSN is provided
const config = process.env.NEXT_PUBLIC_SENTRY_DSN
  ? withSentryConfig(nextConfig, {
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      silent: !process.env.CI,
    })
  : nextConfig;

export default config;
