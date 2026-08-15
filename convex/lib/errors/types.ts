import type { ErrorCodes } from '../../../src/services/errors/constants';

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

/**
 * HTTP status codes supported by error handling.
 * Used internally for mapping to Convex error codes and Sentry severity levels.
 */
export type HttpStatusCode =
  // Bad Request
  | 400
  // Not Authenticated
  | 401
  // Payment Failure
  | 402
  // Not Authorized
  | 403
  // Not Found
  | 404
  // Conflict (Failed to Save)
  | 409
  // Validation Failure
  | 422
  // Too Many Requests
  | 429
  // Server Error
  | 500
  // Not Implemented
  | 501
  // Bad Gateway
  | 502
  // Service Unavailable
  | 503;

/**
 * Sentry severity levels for error reporting.
 */
export type SeverityLevel =
  | 'fatal'
  | 'error'
  | 'warning'
  | 'log'
  | 'info'
  | 'debug';

/**
 * Additional context data for errors.
 * Status codes and severity levels are metadata for logging/debugging, not returned to clients.
 */
export interface ErrorData {
  errorCode?: ErrorCode;
  field?: string;
  level?: SeverityLevel;
  message?: string;
  resource?: string;
  resourceId?: string;
  statusCode?: HttpStatusCode;
  [key: string]: unknown;
}
