/**
 * Severity levels for errors and breadcrumbs, matching Sentry's severity levels.
 * Ordered from most to least severe.
 */
export type SeverityLevel = 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';

/**
 * Mutation status enum, similar to React Query/TanStack Query pattern.
 * Single source of truth for mutation state.
 */
export type MutationStatus = 'idle' | 'loading' | 'success' | 'error';

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
 * Internal state for mutation hooks with error handling.
 */
export interface MutationState<TData = unknown> {
  data: TData | null;
  error: Error | null;
  status: MutationStatus;
}

/**
 * Result returned from useConvexMutation hook.
 * Includes status enum and derived boolean flags for convenience.
 */
export interface MutationResult<TData = unknown> {
  data: TData | null;
  error: Error | null;
  isError: boolean;
  isIdle: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Convex mutation args are dynamic
  mutate: (...args: any[]) => Promise<TData>;
  reset: () => void;
  status: MutationStatus;
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
