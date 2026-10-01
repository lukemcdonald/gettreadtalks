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
  const { level = 'error', transactionName, ...scopeOptions } = options;

  return sentryWithScope((scope) => {
    applyScopeOptions(scope, { ...scopeOptions, level });

    if (transactionName) {
      scope.setTransactionName(transactionName);
    }

    if (typeof error === 'string') {
      return sentryCaptureMessage(error);
    }

    return sentryCaptureException(error);
  });
}

function applyScopeOptions(
  scope: Scope,
  options: Omit<ErrorReportOptions, 'transactionName'>
): void {
  const { context, extras, fingerprint, level = 'info', tags, user } = options;

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

  if (user) {
    scope.setUser(user);
  }

  if (extras) {
    for (const [key, value] of Object.entries(extras)) {
      scope.setExtra(key, value);
    }
  }
}

/** Manual message capture for non-exception events. */
export function captureMessage(
  message: string,
  options: Omit<ErrorReportOptions, 'transactionName'> = {}
): string | undefined {
  return sentryWithScope((scope) => {
    applyScopeOptions(scope, options);
    return sentryCaptureMessage(message, options.level ?? 'info');
  });
}
