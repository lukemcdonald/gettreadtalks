import { captureRequestError } from '@sentry/nextjs';

import { IS_SENTRY_ENABLED } from './src/configs/sentry';

export async function register() {
  if (!IS_SENTRY_ENABLED) {
    return;
  }

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./src/configs/sentry/server');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./src/configs/sentry/edge');
  }
}

// biome-ignore lint/suspicious: no-op function
export const onRequestError = IS_SENTRY_ENABLED ? captureRequestError : () => {};
