import * as Sentry from '@sentry/nextjs';

import { IS_PROD } from '../../constants';
import { baseSentryConfig } from './index';

Sentry.init({
  ...baseSentryConfig,
  attachStacktrace: true,
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
  replaysSessionSampleRate: IS_PROD ? 0.1 : 1.0,

  // Add useful debugging context
  beforeSend(event) {
    if (event.exception) {
      event.extra = {
        ...event.extra,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        connectionType: (navigator as any).connection?.effectiveType || 'unknown',
        referrer: document.referrer || 'direct',
      };
    }
    return event;
  },
});
