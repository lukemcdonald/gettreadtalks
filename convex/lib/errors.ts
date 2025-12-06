import { ConvexError, type Value } from 'convex/values';

import { ErrorCodes } from '../../src/services/errors/constants';

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

export { ErrorCodes } from '../../src/services/errors/constants';

/**
 * HTTP status codes that map to Convex error codes.
 * Used by throwConvexError to map traditional HTTP status codes to ConvexError.
 * Note: These are included as metadata in errors, not returned to clients.
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
 * Sentry severity levels that match Sentry's SeverityLevel type.
 * Used for error reporting and logging.
 */
export type SeverityLevel = 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';

/**
 * Context information that can be attached to errors.
 * Status codes and severity levels are included as metadata for developer convenience,
 * logging, debugging, and future Sentry auto-leveling. They are not returned to clients.
 */
export type ErrorData = {
  [key: string]: unknown;
  errorCode?: ErrorCode;
  field?: string;
  level?: SeverityLevel;
  message?: string;
  resource?: string;
  resourceId?: string;
  statusCode?: HttpStatusCode;
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
  throwConvexError(401, message);
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
  throwConvexError(403, message);
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
  throwConvexError(404, message, data);
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
  throwConvexError(409, message, { field });
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
  throwConvexError(422, message, { field });
}

/**
 * Maps HTTP status codes to Convex error codes.
 * Used internally by throwConvexError.
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
 * Maps HTTP status codes to Sentry severity levels.
 * Used internally by throwConvexError to automatically set error severity.
 * Enables future auto-leveling in Sentry based on status codes.
 */
const STATUS_TO_LEVEL: Record<HttpStatusCode, SeverityLevel> = {
  400: 'warning', // Bad Request - client error
  401: 'warning', // Not Authenticated - expected auth failure
  402: 'error', // Payment Failure - business critical
  403: 'warning', // Not Authorized - expected permission failure
  404: 'warning', // Not Found - expected resource missing
  409: 'warning', // Conflict - expected duplicate
  422: 'warning', // Validation Failure - expected validation error
  429: 'warning', // Too Many Requests - expected rate limit
  500: 'error', // Server Error - unexpected failure
  501: 'warning', // Not Implemented - expected feature missing
  502: 'error', // Bad Gateway - unexpected network failure
  503: 'error', // Service Unavailable - unexpected service failure
};

/**
 * Throws a ConvexError mapped from an HTTP status code.
 * Automatically includes both statusCode and severity level in error data.
 * Use this when you want to think in HTTP status code terms or for less common errors.
 *
 * For common errors, prefer the specific functions:
 * - `throwAuthRequired()` for 401
 * - `throwForbidden()` for 403
 * - `throwNotFound()` for 404
 * - `throwDuplicateSlug()` for 409
 * - `throwValidationError()` for 422
 *
 * Note: Status codes and severity levels are included as metadata for developer convenience,
 * logging, debugging, and future Sentry auto-leveling. They are not returned to clients.
 *
 * @example
 * // Payment failure
 * if (paymentFailed) {
 *   throwConvexError(402, 'Payment processing failed', { paymentId });
 * }
 *
 * @example
 * // Rate limit
 * if (requestCount > limit) {
 *   throwConvexError(429, 'Too many requests', { retryAfter: 60 });
 * }
 *
 * @example
 * // Not implemented
 * if (!isImplemented) {
 *   throwConvexError(501, 'Feature not yet implemented');
 * }
 */
export function throwConvexError(
  status: HttpStatusCode,
  message: string,
  data?: Omit<ErrorData, 'errorCode' | 'statusCode' | 'level'>,
): never {
  const errorCode = STATUS_TO_ERROR_CODE[status];
  const level = STATUS_TO_LEVEL[status];

  throw createConvexError(message, {
    errorCode,
    level,
    statusCode: status,
    ...data,
  });
}
