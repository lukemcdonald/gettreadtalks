import type { ErrorData, HttpStatusCode } from './types';

import { ConvexError, type Value } from 'convex/values';

import { STATUS_TO_ERROR_CODE, STATUS_TO_LEVEL } from './constants';

export type { ErrorCode, ErrorData, HttpStatusCode, SeverityLevel } from './types';

export { ErrorCodes } from '../../../src/services/errors/constants';

/**
 * Creates a ConvexError with structured error data.
 *
 * @example
 * throw createConvexError('User not found', {
 *   errorCode: ErrorCodes.NOT_FOUND,
 *   resource: 'user',
 *   resourceId: userId,
 * });
 */
export function createConvexError(message: string, data?: ErrorData): ConvexError<Value> {
  return new ConvexError({ message, ...data });
}

/**
 * Throws a ConvexError mapped from an HTTP status code.
 * Automatically includes statusCode and severity level in error data.
 *
 * For common errors, prefer the specific functions: `throwAuthRequired()`, `throwForbidden()`,
 * `throwNotFound()`, `throwDuplicateSlug()`, or `throwValidationError()`.
 *
 * @example
 * if (paymentFailed) {
 *   throwConvexError(402, 'Payment processing failed', { paymentId });
 * }
 */
export function throwConvexError(
  statusCode: HttpStatusCode,
  message: string,
  data?: Omit<ErrorData, 'errorCode' | 'statusCode' | 'level'>,
): never {
  const errorCode = STATUS_TO_ERROR_CODE[statusCode];
  const level = STATUS_TO_LEVEL[statusCode];

  throw createConvexError(message, {
    errorCode,
    level,
    statusCode,
    ...data,
  });
}

/**
 * Throws an authentication required error (401).
 *
 * @example
 * if (!userId) throwAuthRequired();
 */
export function throwAuthRequired(message?: string): never {
  throwConvexError(401, message ?? 'Authentication required');
}

/**
 * Throws a forbidden error (403).
 *
 * @example
 * if (userId !== resource.ownerId) {
 *   throwForbidden('You do not have permission to edit this resource');
 * }
 */
export function throwForbidden(message?: string): never {
  throwConvexError(403, message ?? 'Forbidden');
}

/**
 * Throws a not found error (404).
 *
 * @example
 * const topic = await ctx.db.get('topics', topicId);
 * if (!topic) {
 *   throwNotFound('Topic not found', { resource: 'topic', resourceId: topicId });
 * }
 */
export function throwNotFound(
  message?: string,
  data?: Pick<ErrorData, 'resource' | 'resourceId'>,
): never {
  throwConvexError(404, message ?? 'Resource not found', data);
}

/**
 * Throws a duplicate slug error (409).
 *
 * @example
 * if (await slugExists(ctx, 'topics', slug)) {
 *   throwDuplicateSlug('Topic with this title already exists', 'title');
 * }
 */
export function throwDuplicateSlug(message?: string, field?: string): never {
  throwConvexError(409, message ?? 'Resource already exists', { field });
}

/**
 * Throws a validation error (422).
 *
 * @example
 * if (!isValidEmail(email)) {
 *   throwValidationError('Invalid email address', 'email');
 * }
 */
export function throwValidationError(message: string, field?: string): never {
  throwConvexError(422, message, { field });
}
