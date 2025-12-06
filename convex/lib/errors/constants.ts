import type { ErrorCode, HttpStatusCode, SeverityLevel } from './types';

import { ErrorCodes } from '../../../src/services/errors/constants';

/**
 * Maps HTTP status codes to Convex error codes.
 */
export const STATUS_TO_ERROR_CODE: Record<HttpStatusCode, ErrorCode> = {
  400: ErrorCodes.INVALID_INPUT,
  401: ErrorCodes.AUTH_REQUIRED,
  402: ErrorCodes.PAYMENT_FAILED,
  403: ErrorCodes.FORBIDDEN,
  404: ErrorCodes.NOT_FOUND,
  409: ErrorCodes.DUPLICATE_SLUG,
  422: ErrorCodes.VALIDATION_FAILED,
  429: ErrorCodes.RATE_LIMIT_EXCEEDED,
  500: ErrorCodes.SERVER_ERROR,
  501: ErrorCodes.NOT_IMPLEMENTED,
  502: ErrorCodes.NETWORK_ERROR,
  503: ErrorCodes.SERVER_ERROR,
};

/**
 * Maps HTTP status codes to Sentry severity levels.
 */
export const STATUS_TO_LEVEL: Record<HttpStatusCode, SeverityLevel> = {
  400: 'warning',
  401: 'warning',
  402: 'error',
  403: 'warning',
  404: 'warning',
  409: 'warning',
  422: 'warning',
  429: 'warning',
  500: 'error',
  501: 'warning',
  502: 'error',
  503: 'error',
};
