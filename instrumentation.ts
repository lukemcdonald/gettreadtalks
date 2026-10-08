import { captureRequestError } from '@sentry/nextjs';

import { IS_SENTRY_ENABLED } from '@/configs/sentry';

export async function register() {
  if (!IS_SENTRY_ENABLED) {
    return;
  }

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

export const onRequestError = IS_SENTRY_ENABLED
  ? captureRequestError
  : () => {};
