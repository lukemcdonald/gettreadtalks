'use client';

import type { ComponentType, ErrorInfo, ReactNode } from 'react';
import type { FallbackProps } from 'react-error-boundary';
import type { ErrorWithEventId } from '@/services/errors/types';

import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

import { ErrorFallback } from '@/components/error-fallback';
import { captureException } from '@/services/errors/client';

// Regex to remove "error" suffix from error names (case-insensitive)
const ERROR_NAME_SUFFIX_REGEX = /error$/i;

interface ErrorBoundaryProps {
  /**
   * The content to render within the error boundary.
   */
  children: ReactNode;

  /**
   * Custom fallback component to render when an error occurs.
   * If not provided, uses the default ErrorFallback component.
   */
  fallback?: ComponentType<FallbackProps & { eventId?: string }>;

  /**
   * Callback fired when an error is caught.
   * Useful for custom logging or side effects.
   */
  onError?: (error: Error, info: ErrorInfo) => void;

  /**
   * Callback fired when the error boundary resets.
   * Use this to reset application state if needed.
   */
  onReset?: () => void;
}

/**
 * Error boundary component that catches React errors and reports them to Sentry.
 * Wraps react-error-boundary with Sentry integration and provides a fallback UI.
 *
 * @example
 * // App-level boundary
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 *
 * @example
 * // Feature-level boundary with custom fallback
 * <ErrorBoundary fallback={CustomErrorUI}>
 *   <FeatureComponent />
 * </ErrorBoundary>
 *
 * @example
 * // With custom error handling
 * <ErrorBoundary
 *   onError={(error) => {
 *     console.log('Custom error handling:', error);
 *   }}
 *   onReset={() => {
 *     // Reset application state
 *   }}
 * >
 *   <Component />
 * </ErrorBoundary>
 */
export function ErrorBoundary({
  children,
  fallback: FallbackComponent = ErrorFallback,
  onError,
  onReset,
}: ErrorBoundaryProps) {
  const handleError = (error: unknown, info: ErrorInfo) => {
    const err = error instanceof Error ? error : new Error(String(error));

    // Report to Sentry with fingerprinting and capture event ID
    const eventId = captureException(err, {
      context: {
        details: { componentStack: info.componentStack },
      },
      fingerprint: ['error', err.name.toLowerCase().replace(ERROR_NAME_SUFFIX_REGEX, '')],
      tags: { errorName: err.name },
    });

    // Store event ID for the fallback component
    (err as ErrorWithEventId).__sentryEventId = eventId;

    // Call custom error handler if provided
    onError?.(err, info);
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={(props) => (
        <FallbackComponent {...props} eventId={(props.error as ErrorWithEventId).__sentryEventId} />
      )}
      onError={handleError}
      onReset={onReset}
    >
      {children}
    </ReactErrorBoundary>
  );
}
