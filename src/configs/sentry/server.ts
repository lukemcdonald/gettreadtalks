import * as Sentry from '@sentry/nextjs';

import { DEPLOY_ENV } from '@/constants/env';

import { baseSentryConfig } from './index';

Sentry.init({
  ...baseSentryConfig,

  // Server-specific profiling
  profilesSampleRate: DEPLOY_ENV === 'prod' ? 0.1 : 1,
});
