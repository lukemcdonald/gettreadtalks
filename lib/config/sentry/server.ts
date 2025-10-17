import * as Sentry from '@sentry/nextjs';

import { IS_DEV } from '../../constants';

import { baseSentryConfig } from './index';

Sentry.init({
  ...baseSentryConfig,

  // Server-specific profiling
  profilesSampleRate: IS_DEV ? 1.0 : 0.1,
});
