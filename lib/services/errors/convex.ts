import { ConvexError } from 'convex/values';

import { ErrorCode, ErrorContext } from './types';

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
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- ConvexError requires type parameter but data structure is dynamic
export function isConvexError(error: unknown): error is ConvexError<any> {
  return error instanceof ConvexError;
}

/**
 * Extracts error data from a ConvexError, returns empty object if not a ConvexError.
 *
 * @example
 * const errorData = getConvexErrorData(error);
 * console.log(errorData.code); // ErrorCode.VALIDATION_FAILED
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
 * Gets the error code from a ConvexError, returns UNKNOWN_ERROR if not available.
 *
 * @example
 * const code = getErrorCode(error);
 * if (code === ErrorCode.AUTH_REQUIRED) {
 *   redirect('/login');
 * }
 */
export function getErrorCode(error: unknown): ErrorCode {
  const data = getConvexErrorData(error);

  return data.code || ErrorCode.UNKNOWN_ERROR;
}

/**
 * Checks if an error is a specific error code.
 *
 * @example
 * if (isErrorCode(error, ErrorCode.DUPLICATE_SLUG)) {
 *   setError('title', { message: 'Title already exists' });
 * }
 */
export function isErrorCode(error: unknown, code: ErrorCode): boolean {
  return getErrorCode(error) === code;
}

/**
 * Formats error details for display or logging.
 *
 * @example
 * console.error(formatErrorDetails(error));
 */
export function formatErrorDetails(error: unknown): string {
  const message = getErrorMessage(error);
  const data = getConvexErrorData(error);

  if (Object.keys(data).length === 0) {
    return message;
  }

  return `${message}\nDetails: ${JSON.stringify(data, null, 2)}`;
}
