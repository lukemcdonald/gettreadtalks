import { DEPLOY_ENV, IS_PROD } from '../../constants/env';

const SENTRY_DEBUG = process.env.NEXT_PUBLIC_SENTRY_DEBUG === 'true';
const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const SENTRY_ENABLED = process.env.NEXT_PUBLIC_SENTRY_ENABLED !== 'false';

export const IS_SENTRY_ENABLED = SENTRY_ENABLED && !!SENTRY_DSN;

export const baseSentryConfig = {
  debug: SENTRY_DEBUG,
  dsn: SENTRY_DSN,
  environment: DEPLOY_ENV,
  initialScope: {
    tags: {
      platform: 'nextjs',
      service: 'frontend',
    },
  },
  tracesSampleRate: IS_PROD ? 0.1 : 1.0,
};
