import { APP_ENV, IS_DEV } from '../../constants';

/**
 * Sentry control
 * - Set NEXT_PUBLIC_SENTRY_ENABLED=false to disable (default: enabled)
 * - DSN must be provided in .env.local
 */
const SENTRY_ENABLED = process.env.NEXT_PUBLIC_SENTRY_ENABLED !== 'false';
const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

/**
 * True if Sentry is both enabled and has a valid DSN
 * Use this to check if Sentry should be active
 */
export const IS_SENTRY_ENABLED = SENTRY_ENABLED && !!SENTRY_DSN;

/**
 * Base Sentry configuration shared across all runtimes
 *
 * Environments: local, dev, preview, prod (matches Convex)
 */
export const baseSentryConfig = {
  debug: process.env.NEXT_PUBLIC_SENTRY_DEBUG === 'true',
  dsn: IS_SENTRY_ENABLED ? SENTRY_DSN : undefined,
  environment: APP_ENV,
  initialScope: {
    tags: {
      platform: 'nextjs',
      service: 'frontend',
    },
  },
  tracesSampleRate: IS_DEV ? 1.0 : 0.1,
};
