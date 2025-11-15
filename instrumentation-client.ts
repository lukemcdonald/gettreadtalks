// This file initializes Sentry on the client side.
// It runs before your application becomes interactive.
// https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation

import { captureRouterTransitionStart } from '@sentry/nextjs';

import { IS_SENTRY_ENABLED } from './src/lib/config/sentry';

if (IS_SENTRY_ENABLED) {
  import('./src/lib/config/sentry/client');
}

// Export the router transition hook for Sentry navigation instrumentation
// biome-ignore lint/suspicious: no-op function
export const onRouterTransitionStart = IS_SENTRY_ENABLED ? captureRouterTransitionStart : () => {};
