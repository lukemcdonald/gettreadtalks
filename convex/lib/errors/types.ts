import type { ErrorCodes } from '../../../src/services/errors/constants';

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

/**
 * HTTP status codes supported by error handling.
 * Used internally for mapping to Convex error codes and Sentry severity levels.
 */
export type HttpStatusCode =
  | 400 // Bad Request
  | 401 // Not Authenticated
  | 402 // Payment Failure
  | 403 // Not Authorized
  | 404 // Not Found
  | 409 // Conflict (Failed to Save)
  | 422 // Validation Failure
  | 429 // Too Many Requests
  | 500 // Server Error
  | 501 // Not Implemented
  | 502 // Bad Gateway
  | 503; // Service Unavailable

/**
 * Sentry severity levels for error reporting.
 */
export type SeverityLevel = 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';

/**
 * Additional context data for errors.
 * Status codes and severity levels are metadata for logging/debugging, not returned to clients.
 */
export interface ErrorData {
  [key: string]: unknown;
  errorCode?: ErrorCode;
  field?: string;
  level?: SeverityLevel;
  message?: string;
  resource?: string;
  resourceId?: string;
  statusCode?: HttpStatusCode;
}
