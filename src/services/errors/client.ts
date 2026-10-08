import type { ErrorReportOptions } from './types';
import type { Scope } from '@sentry/nextjs';

import {
  captureException as sentryCaptureException,
  captureMessage as sentryCaptureMessage,
  withScope as sentryWithScope,
} from '@sentry/nextjs';

/** Manual exception capture with optional fingerprint, tags, and context. */
export function captureException(
  error: unknown,
  options: ErrorReportOptions = {}
): string | undefined {
  const { level = 'error', ...scopeOptions } = options;

  return sentryWithScope((scope) => {
    applyScopeOptions(scope, { ...scopeOptions, level });

    if (typeof error === 'string') {
      return sentryCaptureMessage(error);
    }

    return sentryCaptureException(error);
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
  return sentryWithScope((scope) => {
    applyScopeOptions(scope, options);

    return sentryCaptureMessage(message, options.level ?? 'info');
  });
}
