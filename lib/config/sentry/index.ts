import { APP_ENV, IS_DEV } from '@/lib/constants';

/**
 * Sentry control
 * - Set NEXT_PUBLIC_SENTRY_ENABLED=false to disable (default: enabled)
 * - DSN stays in .env.local
 */
const SENTRY_ENABLED = process.env.NEXT_PUBLIC_SENTRY_ENABLED !== 'false';
const SENTRY_DSN = SENTRY_ENABLED ? process.env.NEXT_PUBLIC_SENTRY_DSN : undefined;

/**
 * Base Sentry configuration shared across all runtimes
 *
 * Environments: local, dev, preview, prod (matches Convex)
 */
export const baseSentryConfig = {
  debug: process.env.NEXT_PUBLIC_SENTRY_DEBUG === 'true',
  dsn: SENTRY_DSN,
  environment: APP_ENV,
  initialScope: {
    tags: {
      platform: 'nextjs',
      service: 'frontend',
    },
  },
  tracesSampleRate: IS_DEV ? 1.0 : 0.1,
};
