import * as Sentry from '@sentry/nextjs';

import { IS_PROD } from '@/constants/env';
import { baseSentryConfig } from './index';

const config = {
  ...baseSentryConfig,

  // Server-specific profiling
  profilesSampleRate: IS_PROD ? 0.1 : 1.0,
};

// Debug: Log server-side Sentry initialization (only in non-prod)
if (!IS_PROD && process.env.NEXT_PUBLIC_SENTRY_DEBUG === 'true') {
  console.log('[Sentry Server] Initializing with DSN:', config.dsn ? 'Set' : 'Not set');
  console.log('[Sentry Server] Environment:', config.environment);
}

Sentry.init(config);
