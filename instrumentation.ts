import { captureRequestError } from '@sentry/nextjs';

import { IS_SENTRY_ENABLED } from './lib/config/sentry';

export async function register() {
  if (!IS_SENTRY_ENABLED) {
    return;
  }

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./lib/config/sentry/server');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./lib/config/sentry/edge');
  }
}

// biome-ignore lint/suspicious: no-op function
export const onRequestError = IS_SENTRY_ENABLED ? captureRequestError : () => {};
