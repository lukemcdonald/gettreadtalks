import * as Sentry from '@sentry/nextjs';

import {
  baseSentryConfig,
  IS_SENTRY_ENABLED,
  SENTRY_APPLICATION_KEY,
} from '@/configs/sentry';
import { IS_DEV } from '@/constants/env';

if (IS_SENTRY_ENABLED) {
  Sentry.init({
    ...baseSentryConfig,
    integrations: [
      Sentry.thirdPartyErrorFilterIntegration({
        behaviour: 'apply-tag-if-contains-third-party-frames',
        filterKeys: [SENTRY_APPLICATION_KEY],
      }),
    ],
  });

  if (IS_DEV && typeof window !== 'undefined') {
    (window as unknown as { Sentry?: typeof Sentry }).Sentry = Sentry;
  }
}

export const onRouterTransitionStart = IS_SENTRY_ENABLED
  ? Sentry.captureRouterTransitionStart
  : () => {};
