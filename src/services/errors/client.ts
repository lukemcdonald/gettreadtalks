import type { ErrorReportOptions } from './types';
import type { Scope } from '@sentry/nextjs';

import {
  captureException as sentryCaptureException,
  captureMessage as sentryCaptureMessage,
  withScope as sentryWithScope,
} from '@sentry/nextjs';

/**
 * Captures an exception and reports it to Sentry with optional context.
 * Use this for manual error reporting outside of automatic captures.
 *
 * Supports fingerprinting for custom error grouping and transaction names
 * for better organization. Returns the Sentry Event ID for tracking.
 *
 * @example
 * try {
 *   await riskyOperation();
 * } catch (error) {
 *   const eventId = captureException(error, {
 *     context: { operation: 'riskyOperation' },
 *     level: 'warning',
 *     tags: { feature: 'items' },
 *     fingerprint: ['validation', 'slug'],
 *     transactionName: 'items:create',
 *     extras: {
 *       customData: 'value',
 *       attemptNumber: 3,
 *     },
 *   });
 *   // Use eventId for user support or tracking
 * }
 */
export function captureException(
  error: unknown,
  options: ErrorReportOptions = {}
): string | undefined {
  const { transactionName, level = 'error', ...scopeOptions } = options;

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

/**
 * Applies scope options to a Sentry scope for message capture.
 * Helper function that configures level, context, fingerprint, tags, user, and extras.
 */
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

/**
 * Captures a message and reports it to Sentry.
 * Use this for logging important events or non-error messages.
 *
 * @example
 * captureMessage('User completed checkout', {
 *   level: 'info',
 *   tags: { feature: 'checkout' },
 *   extras: { orderId: '123' },
 * });
 */
export function captureMessage(
  message: string,
  options: Omit<ErrorReportOptions, 'transactionName'> = {}
): string | undefined {
  return sentryWithScope((scope) => {
    applyScopeOptions(scope, options);
    return sentryCaptureMessage(message, options.level ?? 'info');
  });
}
