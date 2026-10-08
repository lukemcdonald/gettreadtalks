import type { ErrorCodes } from './constants';
import type { Context as SentryContext, SeverityLevel } from '@sentry/nextjs';

/**
 * Type representing all possible error code values.
 */
export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

/**
 * Context information that can be attached to errors for debugging.
 */
export type ErrorContext = {
  errorCode?: ErrorCode;
  field?: string;
  level?: SeverityLevel;
  resource?: string;
  resourceId?: string;
  statusCode?: number;
} & SentryContext;

/**
 * Error object with optional Sentry Event ID attached.
 */
export type ErrorWithEventId = Error & {
  __sentryEventId?: string;
};

type FingerprintKind =
  | 'auth'
  | 'convex'
  | 'error'
  | 'http'
  | 'media'
  | 'mutation'
  | 'network'
  | 'validation';
export type Fingerprint = [FingerprintKind, ...string[]];

export interface ErrorReportOptions {
  context?: ErrorContext;
  fingerprint?: Fingerprint;
  level?: SeverityLevel;
  tags?: Record<string, string>;
}

/**
 * Mutation status enum, similar to React Query/TanStack Query pattern.
 */
export type MutationStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Internal state for mutation hooks with error handling.
 */
export interface MutationState<TData = unknown> {
  data: TData | null;
  error: Error | null;
  status: MutationStatus;
}

export type { SeverityLevel } from '@sentry/nextjs';

/**
 * Configuration for Sentry error reporting derived from Convex error data.
 */
export interface SentryConfig {
  /** Context data to include in Sentry report */
  context: Record<string, unknown>;
  /** Fingerprint pattern for error grouping (undefined = use Sentry defaults) */
  fingerprint?: Fingerprint;
  /** Severity level for the error */
  level: SeverityLevel;
  /** Whether the error should be logged to Sentry */
  shouldLog: boolean;
  /** Tags for filtering and categorization */
  tags: Record<string, string>;
}
