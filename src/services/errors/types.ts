import type { Context as SentryContext, User as SentryUser, SeverityLevel } from '@sentry/nextjs';

// biome-ignore lint/style/useImportType: ErrorCodes is needed as a value for typeof expression
import { ErrorCodes } from './constants';

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

type FingerprintKind = 'auth' | 'mutation' | 'validation' | 'network' | 'http' | 'error';
export type Fingerprint = [FingerprintKind, ...string[]];

/**
 * Options for error reporting to Sentry.
 */
export interface ErrorReportOptions {
  /** Structured context data (appears in separate section in Sentry) */
  context?: ErrorContext;
  /** Additional unstructured data (appears as Extra Data in Sentry) */
  extras?: Record<string, unknown>;
  /** Custom fingerprint for error grouping in Sentry */
  fingerprint?: Fingerprint;
  /** Severity level (fatal, error, warning, log, info, debug) */
  level?: SeverityLevel;
  /** Tags for filtering and categorization */
  tags?: Record<string, string>;
  /** Transaction name for better error organization */
  transactionName?: string;
  /** User information to associate with the error */
  user?: SentryUser;
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
  /** Whether the error should be logged to Sentry */
  shouldLog: boolean;
  /** Severity level for the error */
  level: SeverityLevel;
  /** Fingerprint pattern for error grouping (undefined = use Sentry defaults) */
  fingerprint?: Fingerprint;
  /** Context data to include in Sentry report */
  context: Record<string, unknown>;
  /** Tags for filtering and categorization */
  tags: Record<string, string>;
}
