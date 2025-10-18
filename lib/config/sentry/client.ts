import * as Sentry from '@sentry/nextjs';

import { IS_PROD } from '../../constants';
import { baseSentryConfig } from './index';

Sentry.init({
  ...baseSentryConfig,
  integrations: [
    Sentry.browserTracingIntegration({
      enableInp: true,
    }),
    Sentry.replayIntegration({
      blockAllMedia: true,
      maskAllText: true,
    }),
  ],
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: IS_PROD ? 0.5 : 0.1,
});
