import type { ErrorReportOptions } from './types';
import type { Scope } from '@sentry/nextjs';

import { enqueueSentryCapture } from '@/configs/sentry/client';

/** Manual exception capture with optional fingerprint, tags, and context. */
export function captureException(
  error: unknown,
  options: ErrorReportOptions = {}
): string | undefined {
  return enqueueSentryCapture((sentry) => {
    const { level = 'error', ...scopeOptions } = options;

    return sentry.withScope((scope) => {
      applyScopeOptions(scope, { ...scopeOptions, level });

      if (typeof error === 'string') {
        return sentry.captureMessage(error);
      }

      return sentry.captureException(error);
    });
  });
}

function applyScopeOptions(scope: Scope, options: ErrorReportOptions): void {
  const { context, fingerprint, level = 'info', tags } = options;

  scope.setLevel(level);

  if (context) {
    scope.setContext('Details', context);
  }

  if (fingerprint) {
    const clean = fingerprint.filter(Boolean);
    scope.setFingerprint(clean);
    scope.setExtra('fingerprint', clean.join('|'));
  }

  if (tags) {
    for (const [key, value] of Object.entries(tags)) {
      scope.setTag(key, value);
    }
  }
}

/** Manual message capture for non-exception events. */
export function captureMessage(
  message: string,
  options: ErrorReportOptions = {}
): string | undefined {
  return enqueueSentryCapture((sentry) =>
    sentry.withScope((scope) => {
      applyScopeOptions(scope, options);

      return sentry.captureMessage(message, options.level ?? 'info');
    })
  );
}
