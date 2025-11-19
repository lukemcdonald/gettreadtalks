/**
 * Common error codes used throughout the application.
 * Single source of truth for error codes (used by both backend and frontend).
 * Part of the error handling service infrastructure.
 */
export const ErrorCodes = {
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
