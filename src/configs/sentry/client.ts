import {
  breadcrumbsIntegration,
  browserTracingIntegration,
  thirdPartyErrorFilterIntegration,
} from '@sentry/nextjs';
import * as Sentry from '@sentry/nextjs';

import { IS_DEV } from '@/constants/env';

import { baseSentryConfig } from './index';

if (IS_DEV && typeof window !== 'undefined') {
  (window as unknown as { Sentry?: typeof Sentry }).Sentry = Sentry;
}

Sentry.init({
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
