import * as Sentry from '@sentry/nextjs';

import { ErrorReportOptions, SeverityLevel } from './types';

/**
 * Captures an exception and reports it to Sentry with optional context.
 * Use this for manual error reporting outside of automatic captures.
 *
 * @example
 * try {
 *   await riskyOperation();
 * } catch (error) {
 *   captureException(error, {
 *     context: { operation: 'riskyOperation' },
 *     level: 'warning',
 *   });
 * }
 */
export function captureException(error: unknown, options: ErrorReportOptions = {}): void {
  const { context, level = 'error', tags, user } = options;

  Sentry.withScope((scope) => {
    // Set error level
    scope.setLevel(level);

    // Add context data
    if (context) {
      scope.setContext('error_context', context);
    }

    // Add tags
    if (tags) {
      Object.entries(tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    // Set user context
    if (user) {
      scope.setUser(user);
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
