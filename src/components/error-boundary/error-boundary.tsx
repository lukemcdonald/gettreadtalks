'use client';

import type { ComponentType, ErrorInfo, ReactNode } from 'react';
import type { FallbackProps } from 'react-error-boundary';

import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

import { ErrorFallback } from '@/components/error-fallback';

import { BoundFallback, FallbackContext } from './bound-fallback';
import { consumeCapturedError } from './capture-error';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ComponentType<FallbackProps & { eventId?: string }>;
  onError?: (error: Error, info: ErrorInfo) => void;
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
  fallback = ErrorFallback,
  onError,
  onReset,
}: ErrorBoundaryProps) {
  const handleError = (error: unknown, info: ErrorInfo) => {
    const captured = consumeCapturedError(error);
    onError?.(captured, info);
  };

  return (
    <FallbackContext value={fallback}>
      <ReactErrorBoundary
        FallbackComponent={BoundFallback}
        onError={handleError}
        onReset={onReset}
      >
        {children}
      </ReactErrorBoundary>
    </FallbackContext>
  );
}
