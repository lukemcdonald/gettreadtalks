import { ConvexError, type Value } from 'convex/values';

/**
 * Common error codes for backend operations.
 * Keep in sync with lib/services/errors/types.ts ErrorCode enum.
 */
export const ErrorCode = {
  // Authentication & Authorization
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  SESSION_EXPIRED: 'SESSION_EXPIRED',

  // Validation
  DUPLICATE_SLUG: 'DUPLICATE_SLUG',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_FIELD: 'MISSING_FIELD',
  VALIDATION_FAILED: 'VALIDATION_FAILED',

  // Resource
  NOT_FOUND: 'NOT_FOUND',
  RESOURCE_DELETED: 'RESOURCE_DELETED',

  // System
  DATABASE_ERROR: 'DATABASE_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode];

/**
 * Context information that can be attached to errors.
 */
export type ErrorData = {
  [key: string]: unknown;
  code?: ErrorCodeType;
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
 *   code: ErrorCode.NOT_FOUND,
 *   resource: 'user',
 *   resourceId: userId,
 * });
 *
 * @example
 * // Validation error
 * throw createConvexError('Title already exists', {
 *   code: ErrorCode.DUPLICATE_SLUG,
 *   field: 'title',
 * });
 */
export function createConvexError(message: string, data?: ErrorData): ConvexError<Value> {
  return new ConvexError({
    message,
    ...data,
  });
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
    code: ErrorCode.AUTH_REQUIRED,
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
    code: ErrorCode.FORBIDDEN,
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
    code: ErrorCode.NOT_FOUND,
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
    code: ErrorCode.DUPLICATE_SLUG,
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
    code: ErrorCode.VALIDATION_FAILED,
    field,
  });
}
