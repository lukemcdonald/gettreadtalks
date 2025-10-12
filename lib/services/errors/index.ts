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

// Hooks
export { useMutationWithErrorHandling } from './hooks';

// Types
export { ErrorCode } from './types';
export type { ErrorContext, ErrorReportOptions, MutationState, SeverityLevel } from './types';
