/**
 * Severity levels for errors and breadcrumbs, matching Sentry's severity levels.
 */
export type SeverityLevel = 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';

/**
 * Mutation status enum, similar to React Query/TanStack Query pattern.
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
  mutate: (...args: unknown[]) => Promise<TData>;
  reset: () => void;
  status: MutationStatus;
}

/**
 * Error object with optional Sentry Event ID attached.
 */
export interface ErrorWithEventId extends Error {
  __sentryEventId?: string;
}

/**
 * Options for error reporting to Sentry.
 */
export interface ErrorReportOptions {
  /** Structured context data (appears in separate section in Sentry) */
  context?: ErrorContext;
  /** Additional unstructured data (appears as Extra Data in Sentry) */
  extras?: Record<string, unknown>;
  /** Custom fingerprint for error grouping in Sentry */
  fingerprint?: string[];
  /** Severity level (fatal, error, warning, log, info, debug) */
  level?: SeverityLevel;
  /** Tags for filtering and categorization */
  tags?: Record<string, string>;
  /** Transaction name for better error organization */
  transactionName?: string;
  /** User information to associate with the error */
  user?: {
    email?: string;
    id?: string;
    username?: string;
  };
}
