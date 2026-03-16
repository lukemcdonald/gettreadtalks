import type { Scope } from '@sentry/nextjs';
import type { ErrorReportOptions, ErrorWithEventId, SeverityLevel } from './types';

import {
  addBreadcrumb as sentryAddBreadcrumb,
  captureException as sentryCaptureException,
  captureMessage as sentryCaptureMessage,
  setUser as sentrySetUser,
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
  options: ErrorReportOptions = {},
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
 * Sets user context for error reporting.
 * Call this when user logs in to associate errors with users.
 *
 * @example
 * setUserContext({
 *   id: user._id,
 *   email: user.email,
 * });
 */
export function setUserContext(user: { id: string; email?: string; username?: string }): void {
  sentrySetUser(user);
}

/**
 * Gets the Sentry Event ID from an error object if it was captured.
 * Useful for displaying event IDs to users for support purposes.
 *
 * @example
 * const eventId = getEventIdFromError(error);
 * if (eventId) {
 *   console.log('Error reported with ID:', eventId);
 * }
 */
export function getEventIdFromError(error: unknown): string | undefined {
  return (error as ErrorWithEventId).__sentryEventId;
}

/**
 * Clears user context for error reporting.
 * Call this when user logs out.
 *
 * @example
 * clearUserContext();
 */
export function clearUserContext(): void {
  sentrySetUser(null);
}

/**
 * Applies scope options to a Sentry scope for message capture.
 * Helper function that configures level, context, fingerprint, tags, user, and extras.
 */
function applyScopeOptions(
  scope: Scope,
  options: Omit<ErrorReportOptions, 'transactionName'>,
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
  options: Omit<ErrorReportOptions, 'transactionName'> = {},
): string | undefined {
  return sentryWithScope((scope) => {
    applyScopeOptions(scope, options);
    return sentryCaptureMessage(message, options.level ?? 'info');
  });
}

/**
 * Adds a breadcrumb for debugging context.
 * Breadcrumbs are logged events that lead up to an error.
 *
 * @example
 * addBreadcrumb({
 *   message: 'User clicked submit',
 *   category: 'user-action',
 *   level: 'info',
 * });
 */
export function addBreadcrumb(breadcrumb: {
  category?: string;
  data?: Record<string, unknown>;
  level?: SeverityLevel;
  message: string;
}): void {
  sentryAddBreadcrumb(breadcrumb);
}
