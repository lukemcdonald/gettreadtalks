import 'server-only';

import type { ZodError, ZodSchema } from 'zod';

import { z } from 'zod';

import { ErrorCodes } from '@/services/errors/constants';
import { getConvexErrorData, getErrorMessage, isConvexError } from '@/services/errors/convex';

/**
 * Maps Zod validation errors to field-level error object.
 * Used by Server Actions to return field-specific errors to forms.
 *
 * @param zodError - Zod error from schema validation
 * @returns Record mapping field names to error messages
 *
 * @example
 * ```ts
 * const parsed = schema.safeParse(data);
 * if (!parsed.success) {
 *   return { success: false, errors: mapZodErrors(parsed.error) };
 * }
 * ```
 */
export function mapZodErrors(zodError: ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const err of zodError.issues) {
    const field = err.path[0] as string;
    if (field) {
      errors[field] = err.message;
    }
  }
  return errors;
}

/**
 * Maps Convex errors to form field errors.
 * Extracts field information from structured Convex error data when available.
 *
 * @param error - Error caught from Convex mutation
 * @returns Record mapping field names to error messages, or '_form' for generic errors
 *
 * @example
 * ```ts
 * catch (error) {
 *   return { success: false, errors: mapConvexErrorToFormErrors(error) };
 * }
 * ```
 */
export function mapConvexErrorToFormErrors(error: unknown): Record<string, string> {
  const errorMessage = getErrorMessage(error);

  // If it's a structured Convex error, extract field information
  if (isConvexError(error)) {
    const errorData = getConvexErrorData(error);

    // If error has a field property, map to that field
    if (errorData.field && typeof errorData.field === 'string') {
      return { [errorData.field]: errorMessage };
    }

    // Check for specific error codes that map to fields
    if (errorData.errorCode === ErrorCodes.DUPLICATE_SLUG) {
      // Duplicate slug errors typically relate to title field
      return { title: errorMessage };
    }
  }

  // Fallback: generic form error
  return { _form: errorMessage };
}
