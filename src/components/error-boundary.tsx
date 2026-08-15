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
const wrappedThrownObjects = new WeakMap<object, Error>();
const wrappedThrownPrimitives = new Map<unknown, Error>();

function toError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  if (
    error !== null &&
    (typeof error === 'object' || typeof error === 'function')
  ) {
    const cached = wrappedThrownObjects.get(error);
    if (cached) {
      return cached;
    }

    const wrapped = new Error(String(error));
    wrappedThrownObjects.set(error, wrapped);
    return wrapped;
  }

  const cached = wrappedThrownPrimitives.get(error);
  if (cached) {
    return cached;
  }

  const wrapped = new Error(String(error));
  wrappedThrownPrimitives.set(error, wrapped);
  return wrapped;
}

function getCapturedError(error: unknown): ErrorWithEventId {
  const err = toError(error) as ErrorWithEventId;

  if (!Object.hasOwn(err, '__sentryEventId')) {
    err.__sentryEventId = captureException(err);
  }

  return err;
}

function BoundFallback({ error, resetErrorBoundary }: FallbackProps) {
  const Fallback = use(FallbackContext);
  const captured = getCapturedError(error);

  return createElement(Fallback, {
    error,
    eventId: captured.__sentryEventId,
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
    onError?.(getCapturedError(error), info);
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
