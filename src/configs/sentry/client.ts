import {
  breadcrumbsIntegration,
  browserTracingIntegration,
  init,
  thirdPartyErrorFilterIntegration,
} from '@sentry/nextjs';

import { IS_DEV } from '@/constants/env';

import { baseSentryConfig } from './index';

if (IS_DEV && typeof window !== 'undefined') {
  (
    window as unknown as {
      Sentry?: {
        breadcrumbsIntegration: typeof breadcrumbsIntegration;
        browserTracingIntegration: typeof browserTracingIntegration;
        init: typeof init;
        thirdPartyErrorFilterIntegration: typeof thirdPartyErrorFilterIntegration;
      };
    }
  ).Sentry = {
    breadcrumbsIntegration,
    browserTracingIntegration,
    init,
    thirdPartyErrorFilterIntegration,
  };
}

init({
  ...baseSentryConfig,
  attachStacktrace: true,
  beforeSend(event) {
    if (event.exception) {
      event.extra = {
        ...event.extra,
        referrer: document.referrer,
      };
    }
    return event;
  },
  integrations: [
    browserTracingIntegration({
      enableInp: true,
    }),
    breadcrumbsIntegration({
      console: false,
      dom: false,
      fetch: false,
      history: false,
      xhr: false,
    }),
    thirdPartyErrorFilterIntegration({
      behaviour: 'apply-tag-if-contains-third-party-frames',
      filterKeys: ['gettreadtalks-app'],
    }),
  ],
});
