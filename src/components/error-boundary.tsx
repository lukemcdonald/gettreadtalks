'use client';

import type { ErrorWithEventId } from '@/services/errors/types';
import type { ComponentType, ErrorInfo, ReactNode } from 'react';
import type { FallbackProps } from 'react-error-boundary';

import { createContext, createElement, use } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

import { ErrorFallback } from '@/components/error-fallback';
import { captureException } from '@/services/errors/client';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ComponentType<FallbackProps & { eventId?: string }>;
  onError?: (error: Error, info: ErrorInfo) => void;
  onReset?: () => void;
}

type FallbackComponent = ComponentType<FallbackProps & { eventId?: string }>;

const FallbackContext = createContext<FallbackComponent>(ErrorFallback);

function getSentryEventId(error: unknown): string | undefined {
  if (!(error instanceof Error)) {
    return undefined;
  }

  const err = error as ErrorWithEventId;
  if (err.__sentryEventId) {
    return err.__sentryEventId;
  }

  const eventId = captureException(err);
  err.__sentryEventId = eventId;
  return eventId;
}

function BoundFallback({ error, resetErrorBoundary }: FallbackProps) {
  const Fallback = use(FallbackContext);

  return createElement(Fallback, {
    error,
    eventId: getSentryEventId(error),
    resetErrorBoundary,
  });
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
    const err = error instanceof Error ? error : new Error(String(error));
    getSentryEventId(err);
    onError?.(err, info);
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
