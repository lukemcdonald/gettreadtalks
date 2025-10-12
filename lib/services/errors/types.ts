/**
 * Severity levels for errors and breadcrumbs, matching Sentry's severity levels.
 * Ordered from most to least severe.
 */
export type SeverityLevel = 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';

/**
 * Common error codes used throughout the application.
 * These should be used with ConvexError for consistent error handling.
 */
export enum ErrorCode {
  // Authentication & Authorization
  AUTH_REQUIRED = 'AUTH_REQUIRED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  SESSION_EXPIRED = 'SESSION_EXPIRED',

  // Validation
  DUPLICATE_SLUG = 'DUPLICATE_SLUG',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_FIELD = 'MISSING_FIELD',
  VALIDATION_FAILED = 'VALIDATION_FAILED',

  // Resource
  NOT_FOUND = 'NOT_FOUND',
  RESOURCE_DELETED = 'RESOURCE_DELETED',

  // System
  DATABASE_ERROR = 'DATABASE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Context information that can be attached to errors for debugging.
 */
export interface ErrorContext {
  [key: string]: unknown;
  code?: ErrorCode;
  field?: string;
  resource?: string;
  resourceId?: string;
}

/**
 * State returned from mutation hooks with error handling.
 */
export interface MutationState<TData = unknown> {
  data: TData | null;
  error: Error | null;
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
}

/**
 * Options for error reporting to Sentry.
 */
export interface ErrorReportOptions {
  context?: ErrorContext;
  level?: SeverityLevel;
  tags?: Record<string, string>;
  user?: {
    email?: string;
    id?: string;
    username?: string;
  };
}
