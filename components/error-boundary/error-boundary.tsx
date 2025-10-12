'use client';

import { ReactNode } from 'react';
import { FallbackProps, ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

import * as Sentry from '@sentry/nextjs';

import { ErrorFallback } from './error-fallback';

interface ErrorBoundaryProps {
  /**
   * The content to render within the error boundary.
   */
  children: ReactNode;

  /**
   * Custom fallback component to render when an error occurs.
   * If not provided, uses the default ErrorFallback component.
   */
  fallback?: React.ComponentType<FallbackProps>;

  /**
   * Callback fired when an error is caught.
   * Useful for custom logging or side effects.
   */
  onError?: (error: Error, info: React.ErrorInfo) => void;

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
  const handleError = (error: Error, info: React.ErrorInfo) => {
    // Report to Sentry
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: info.componentStack,
        },
      },
    });

    // Call custom error handler if provided
    onError?.(error, info);
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={FallbackComponent}
      onError={handleError}
      onReset={onReset}
    >
      {children}
    </ReactErrorBoundary>
  );
}
