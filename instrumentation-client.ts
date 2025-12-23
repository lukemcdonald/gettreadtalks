// This file initializes Sentry on the client side.
// It runs before your application becomes interactive.
// https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation

import { captureRouterTransitionStart } from '@sentry/nextjs';

import { IS_SENTRY_ENABLED } from './src/configs/sentry';

if (IS_SENTRY_ENABLED) {
  // Silently handle import failures - Sentry is non-critical
  import('./src/configs/sentry/client').catch(() => {
    // Ignore import errors - Sentry is optional
  });
}

// Export the router transition hook for Sentry navigation instrumentation
// biome-ignore lint/suspicious: no-op function
export const onRouterTransitionStart = IS_SENTRY_ENABLED ? captureRouterTransitionStart : () => {};
