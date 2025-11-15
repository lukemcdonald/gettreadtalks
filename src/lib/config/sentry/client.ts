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
    // Reduce noise by disabling most breadcrumbs
    Sentry.breadcrumbsIntegration({
      console: false,
      dom: false,
      fetch: false,
      history: false,
      xhr: false,
    }),
    // Filter out third-party errors (browser extensions, widgets, etc.)
    Sentry.thirdPartyErrorFilterIntegration({
      // Application key that matches the one in next.config.ts
      filterKeys: ['gettreadtalks-app'],
      // Tag errors instead of dropping them initially - you can filter in Sentry UI
      // Change to "drop-error-if-contains-third-party-frames" once you're satisfied
      behaviour: 'apply-tag-if-contains-third-party-frames',
    }),
  ],
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: IS_PROD ? 0.1 : 1.0,

  // Add useful debugging context
  beforeSend(event) {
    if (event.exception) {
      event.extra = {
        ...event.extra,
        referrer: document.referrer || 'direct',
      };
    }
    return event;
  },
});
