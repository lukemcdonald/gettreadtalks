import type { ErrorReportOptions } from './types';

import { IS_SENTRY_ENABLED } from '@/configs/sentry';
import {
  applyCaptureOptions,
  bufferSentryEvent,
} from '@/configs/sentry/buffer';
import {
  getClientSentry,
  loadClientSentry,
} from '@/configs/sentry/load-client';

/** Manual exception capture with optional fingerprint, tags, and context. */
export function captureException(
  error: unknown,
  options: ErrorReportOptions = {}
): string | undefined {
  if (!IS_SENTRY_ENABLED) {
    return undefined;
  }

  const sentry = getClientSentry();

  if (sentry) {
    const { level = 'error', ...scopeOptions } = options;

    return sentry.withScope((scope) => {
      applyCaptureOptions(scope, { ...scopeOptions, level }, 'error');

      if (typeof error === 'string') {
        return sentry.captureMessage(error);
      }

      return sentry.captureException(error);
    });
  }

  bufferSentryEvent({
    error,
    kind: 'exception',
    options: {
      ...options,
      level: options.level ?? 'error',
    },
  });
  void loadClientSentry();

  return undefined;
}

/** Manual message capture for non-exception events. */
export function captureMessage(
  message: string,
  options: ErrorReportOptions = {}
): string | undefined {
  if (!IS_SENTRY_ENABLED) {
    return undefined;
  }

  const sentry = getClientSentry();

  if (sentry) {
    return sentry.withScope((scope) => {
      applyCaptureOptions(scope, options, 'info');

      return sentry.captureMessage(message, options.level ?? 'info');
    });
  }

  bufferSentryEvent({
    kind: 'message',
    message,
    options: {
      ...options,
      level: options.level ?? 'info',
    },
  });
  void loadClientSentry();

  return undefined;
}
