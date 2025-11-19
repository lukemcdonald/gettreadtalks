import * as Sentry from '@sentry/nextjs';

import { IS_PROD } from '@/constants/env';
import { baseSentryConfig } from './index';

Sentry.init({
  ...baseSentryConfig,

  // Server-specific profiling
  profilesSampleRate: IS_PROD ? 0.1 : 1.0,
});
