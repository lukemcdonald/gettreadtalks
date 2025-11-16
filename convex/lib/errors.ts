import { ConvexError, type Value } from 'convex/values';

import { ErrorCodes } from '../../src/lib/services/errors/constants';

/**
 * Type representing all possible error code values.
 */
export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

/**
 * Re-export ErrorCodes for convenience in Convex code.
 */
export { ErrorCodes } from '../../src/lib/services/errors/constants';

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
