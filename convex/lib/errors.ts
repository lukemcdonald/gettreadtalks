import { ConvexError, type Value } from 'convex/values';

import { ErrorCodes } from '../../src/services/errors/constants';

/**
 * Type representing all possible error code values.
 */
export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

/**
 * Re-export ErrorCodes for convenience in Convex code.
 */
export { ErrorCodes } from '../../src/services/errors/constants';

/**
 * Context information that can be attached to errors.
 */
export type ErrorData = {
  [key: string]: unknown;
  errorCode?: ErrorCode;
  field?: string;
  message?: string;
  resource?: string;
  resourceId?: string;
};

/**
 * Creates a ConvexError with structured error data.
 * Use this for all application errors in Convex functions.
 *
 * @example
 * // Simple error
 * throw createConvexError('User not found', {
 *   errorCode: ErrorCodes.NOT_FOUND,
 *   resource: 'user',
 *   resourceId: userId,
 * });
 *
 * @example
 * // Validation error
 * throw createConvexError('Title already exists', {
 *   errorCode: ErrorCodes.DUPLICATE_SLUG,
 *   field: 'title',
 * });
 */
export function createConvexError(message: string, data?: ErrorData): ConvexError<Value> {
  return new ConvexError({ message, ...data });
}

/**
 * Throws an authentication required error.
 * Use when a function requires authentication but user is not authenticated.
 *
 * @example
 * if (!userId) {
 *   throwAuthRequired();
 * }
 */
export function throwAuthRequired(message = 'Authentication required'): never {
  throw createConvexError(message, {
    errorCode: ErrorCodes.AUTH_REQUIRED,
  });
}

/**
 * Throws a forbidden error.
 * Use when user is authenticated but lacks permission for the operation.
 *
 * @example
 * if (userId !== resource.ownerId) {
 *   throwForbidden('You do not have permission to edit this resource');
 * }
 */
export function throwForbidden(message = 'Forbidden'): never {
  throw createConvexError(message, {
    errorCode: ErrorCodes.FORBIDDEN,
  });
}

/**
 * Throws a not found error.
 * Use when a requested resource doesn't exist.
 *
 * @example
 * const topic = await ctx.db.get(topicId);
 * if (!topic) {
 *   throwNotFound('Topic not found', { resource: 'topic', resourceId: topicId });
 * }
 */
export function throwNotFound(
  message = 'Resource not found',
  data?: Pick<ErrorData, 'resource' | 'resourceId'>,
): never {
  throw createConvexError(message, {
    errorCode: ErrorCodes.NOT_FOUND,
    ...data,
  });
}

/**
 * Throws a duplicate slug error.
 * Use when attempting to create a resource with a slug that already exists.
 *
 * @example
 * if (await slugExists(ctx, 'topics', slug)) {
 *   throwDuplicateSlug('Topic with this title already exists', 'title');
 * }
 */
export function throwDuplicateSlug(message = 'Resource already exists', field?: string): never {
  throw createConvexError(message, {
    errorCode: ErrorCodes.DUPLICATE_SLUG,
    field,
  });
}

/**
 * Throws a validation error.
 * Use when input validation fails.
 *
 * @example
 * if (!isValidEmail(email)) {
 *   throwValidationError('Invalid email address', 'email');
 * }
 */
export function throwValidationError(message: string, field?: string): never {
  throw createConvexError(message, {
    errorCode: ErrorCodes.VALIDATION_FAILED,
    field,
  });
}

/**
 * HTTP status codes that map to Convex error codes.
 * Used by throwError to map traditional HTTP status codes to ConvexError.
 */
type HttpStatusCode =
  | 400 // Bad Request
  | 401 // Not Authenticated
  | 402 // Payment Failure
  | 403 // Not Authorized
  | 404 // Not Found
  | 409 // Conflict (Failed to Save)
  | 422 // Validation Failure
  | 429 // Too Many Requests
  | 500 // Server Error
  | 501 // Not Implemented
  | 502 // Bad Gateway
  | 503; // Service Unavailable

/**
 * Maps HTTP status codes to Convex error codes.
 * Used internally by throwError.
 */
const STATUS_TO_ERROR_CODE: Record<HttpStatusCode, ErrorCode> = {
  400: ErrorCodes.INVALID_INPUT,
  401: ErrorCodes.AUTH_REQUIRED,
  402: ErrorCodes.PAYMENT_FAILED,
  403: ErrorCodes.FORBIDDEN,
  404: ErrorCodes.NOT_FOUND,
  409: ErrorCodes.DUPLICATE_SLUG,
  422: ErrorCodes.VALIDATION_FAILED,
  429: ErrorCodes.RATE_LIMIT_EXCEEDED,
  500: ErrorCodes.SERVER_ERROR,
  501: ErrorCodes.NOT_IMPLEMENTED,
  502: ErrorCodes.NETWORK_ERROR,
  503: ErrorCodes.SERVER_ERROR,
};

/**
 * Throws a ConvexError mapped from an HTTP status code.
 * Use this when you want to think in HTTP status code terms or for less common errors.
 *
 * For common errors, prefer the specific functions:
 * - `throwAuthRequired()` for 401
 * - `throwForbidden()` for 403
 * - `throwNotFound()` for 404
 * - `throwDuplicateSlug()` for 409
 * - `throwValidationError()` for 422
 *
 * @example
 * // Payment failure
 * if (paymentFailed) {
 *   throwError(402, 'Payment processing failed', { paymentId });
 * }
 *
 * @example
 * // Rate limit
 * if (requestCount > limit) {
 *   throwError(429, 'Too many requests', { retryAfter: 60 });
 * }
 *
 * @example
 * // Not implemented
 * if (!isImplemented) {
 *   throwError(501, 'Feature not yet implemented');
 * }
 */
export function throwError(
  status: HttpStatusCode,
  message: string,
  data?: Omit<ErrorData, 'errorCode'>,
): never {
  const errorCode = STATUS_TO_ERROR_CODE[status];

  throw createConvexError(message, {
    errorCode,
    ...data,
  });
}
