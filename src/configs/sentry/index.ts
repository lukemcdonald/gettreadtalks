import { DEPLOY_ENV } from '../../constants/env';
import { isSentryEnabled } from './enabled';

const SENTRY_DEBUG = process.env.NEXT_PUBLIC_SENTRY_DEBUG === 'true';
const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

export const IS_SENTRY_ENABLED = isSentryEnabled(
  SENTRY_DSN,
  process.env.NEXT_PUBLIC_SENTRY_ENABLED
);

const SENSITIVE_KEY_DENY = ['-ip', '-user', 'forwarded', 'remote-', 'via'];

export const baseSentryConfig = {
  dataCollection: {
    // Better Auth session cookie.
    cookies: false,
    // Server action inputs/results (sign-in and account forms).
    httpBodies: [],
    httpHeaders: {
      // x-forwarded-for and similar client IP headers.
      request: { deny: SENSITIVE_KEY_DENY },
    },
    // User IP/id on the event.
    userInfo: false,
  },
  debug: SENTRY_DEBUG,
  dsn: SENTRY_DSN,
  environment: DEPLOY_ENV,
  initialScope: {
    tags: {
      service: 'frontend',
    },
  },
  tracesSampleRate: DEPLOY_ENV === 'prod' ? 0.1 : 1,
};
