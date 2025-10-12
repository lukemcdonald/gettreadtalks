// Client-side utilities
export { addBreadcrumb, captureException, clearUserContext, setUserContext } from './client';

// Convex-specific utilities
export {
  formatErrorDetails,
  getConvexErrorData,
  getErrorCode,
  getErrorMessage,
  isConvexError,
  isErrorCode,
} from './convex';

// Types
export { ErrorCode } from './types';
export type {
  ErrorContext,
  ErrorReportOptions,
  MutationResult,
  MutationState,
  MutationStatus,
  SeverityLevel,
} from './types';
