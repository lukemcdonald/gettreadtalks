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
  // v11 collects cookies, bodies, and user info by default. Keep the v10 baseline.
  dataCollection: {
    cookies: false,
    databaseQueryData: false,
    genAI: {
      inputs: false,
      outputs: false,
    },
    graphQL: {
      document: false,
      variables: false,
    },
    httpBodies: [],
    httpHeaders: {
      request: { deny: SENSITIVE_KEY_DENY },
      response: { deny: SENSITIVE_KEY_DENY },
    },
    urlQueryParams: { deny: SENSITIVE_KEY_DENY },
    userInfo: false,
  },
  debug: SENTRY_DEBUG,
  dsn: SENTRY_DSN,
  environment: DEPLOY_ENV,
  initialScope: {
    tags: {
      platform: 'nextjs',
      service: 'frontend',
    },
  },
  tracesSampleRate: DEPLOY_ENV === 'prod' ? 0.1 : 1,
};
