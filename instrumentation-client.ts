import { captureRouterTransitionStart, init } from '@sentry/nextjs';
import * as Sentry from '@sentry/nextjs';

import { baseSentryConfig, IS_SENTRY_ENABLED } from '@/configs/sentry';
import { IS_DEV } from '@/constants/env';

if (IS_SENTRY_ENABLED) {
  init(baseSentryConfig);

  if (IS_DEV && typeof window !== 'undefined') {
    (window as unknown as { Sentry?: typeof Sentry }).Sentry = Sentry;
  }
}

export const onRouterTransitionStart = IS_SENTRY_ENABLED
  ? captureRouterTransitionStart
  : () => {};
