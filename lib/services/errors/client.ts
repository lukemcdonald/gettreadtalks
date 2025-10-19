import type { ErrorReportOptions, SeverityLevel } from './types';

import * as Sentry from '@sentry/nextjs';

/**
 * Captures an exception and reports it to Sentry with optional context.
 * Use this for manual error reporting outside of automatic captures.
 *
 * Supports fingerprinting for custom error grouping and transaction names
 * for better organization.
 *
 * @example
 * try {
 *   await riskyOperation();
 * } catch (error) {
 *   captureException(error, {
 *     context: { operation: 'riskyOperation' },
 *     level: 'warning',
 *     tags: { feature: 'items' },
 *     fingerprint: ['items', 'validation', 'slug'],
 *     transactionName: 'items:create',
 *     extras: {
 *       customData: 'value',
 *       attemptNumber: 3,
 *     },
 *   });
 * }
 */
export function captureException(error: unknown, options: ErrorReportOptions = {}): void {
  const { context, extras, fingerprint, level = 'error', tags, transactionName, user } = options;

  Sentry.withScope((scope) => {
    // Set error level
    scope.setLevel(level);

    // Add context data (appears in Context section in Sentry)
    if (context) {
      scope.setContext('error_context', context);
    }

    // Set custom fingerprint for error grouping
    if (fingerprint) {
      scope.setFingerprint(fingerprint);
      // Also add as extra for visibility in Sentry UI
      scope.setExtra('fingerprint', fingerprint.join('|'));
    }

    // Add tags for filtering and categorization
    if (tags) {
      Object.entries(tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    // Set transaction name for better organization
    if (transactionName) {
      scope.setTransactionName(transactionName);
    }

    // Set user context
    if (user) {
      scope.setUser(user);
    }

    // Add extra data (appears in Extra Data section in Sentry)
    if (extras) {
      Object.entries(extras).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }

    // Capture the error
    if (error instanceof Error) {
      Sentry.captureException(error);
    } else {
      Sentry.captureMessage(String(error));
    }
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
export function setUserContext(user: { email?: string; id: string; username?: string }): void {
  Sentry.setUser(user);
}

/**
 * Clears user context for error reporting.
 * Call this when user logs out.
 *
 * @example
 * clearUserContext();
 */
export function clearUserContext(): void {
  Sentry.setUser(null);
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
  Sentry.addBreadcrumb(breadcrumb);
}
