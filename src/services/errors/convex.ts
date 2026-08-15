import type { ErrorContext, Fingerprint, SentryConfig } from './types';
import type { Value } from 'convex/values';

import { ConvexError } from 'convex/values';

import { ErrorCodes } from './constants';

/**
 * Maps HTTP status codes to whether errors should be logged to Sentry.
 * 4xx errors are typically expected and don't need logging.
 * 5xx errors are unexpected and should be logged.
 */
const STATUS_TO_SHOULD_LOG: Record<number, boolean> = {
  400: false,
  401: false,
  402: true,
  403: false,
  404: false,
  409: false,
  422: false,
  429: false,
  500: true,
  501: false,
  502: true,
  503: true,
};

/**
 * Type guard to check if an error is a ConvexError.
 *
 * @example
 * try {
 *   await mutation();
 * } catch (error) {
 *   if (isConvexError(error)) {
 *     console.log(error.data);
 *   }
 * }
 */
export function isConvexError(error: unknown): error is ConvexError<Value> {
  return error instanceof ConvexError;
}

/**
 * Extracts error data from a ConvexError, returns empty object if not a ConvexError.
 *
 * @example
 * const errorData = getConvexErrorData(error);
 * console.log(errorData.errorCode); // ErrorCodes.VALIDATION_FAILED
 */
export function getConvexErrorData(error: unknown): ErrorContext {
  if (isConvexError(error)) {
    return (error.data as ErrorContext) || {};
  }

  return {};
}

/**
 * Gets a user-friendly error message from any error type.
 * Handles ConvexError, standard Error, and unknown errors.
 *
 * @example
 * const message = getErrorMessage(error);
 * toast.error(message);
 */
export function getErrorMessage(error: unknown): string {
  // Handle ConvexError with custom messages
  if (isConvexError(error)) {
    const data = error.data as ErrorContext;

    // Use custom message from error data if available
    if (data.message && typeof data.message === 'string') {
      return data.message;
    }

    // ConvexError doesn't have a message property, use data.message or fallback
    return 'An error occurred';
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Fallback for unknown error types
  return 'An unexpected error occurred';
}

/**
 * Extracts Sentry reporting configuration from a Convex error.
 * Derives shouldLog, fingerprint, context, and tags from error metadata.
 *
 * @example
 * const config = getSentryConfig(error);
 * if (config.shouldLog) {
 *   captureException(error, {
 *     level: config.level,
 *     fingerprint: config.fingerprint,
 *     context: config.context,
 *     tags: config.tags,
 *   });
 * }
 */
export function getSentryConfig(error: unknown): SentryConfig {
  const data = getConvexErrorData(error);
  const {
    errorCode = ErrorCodes.UNKNOWN_ERROR,
    level = 'error',
    resource = '',
    resourceId = '',
    field = '',
    statusCode,
  } = data;

  const shouldLog = statusCode
    ? (STATUS_TO_SHOULD_LOG[statusCode] ?? true)
    : false;

  let fingerprint: Fingerprint | undefined;

  if (isConvexError(error)) {
    fingerprint = ['convex', resource, statusCode?.toString() ?? '', errorCode];
  }

  const context: Record<string, unknown> = {
    details: { field, resource, resourceId },
  };

  const tags: Record<string, string> = {
    errorCode,
  };

  if (statusCode) {
    tags.statusCode = statusCode.toString();
  }

  return {
    context,
    fingerprint,
    level,
    shouldLog,
    tags,
  };
}
