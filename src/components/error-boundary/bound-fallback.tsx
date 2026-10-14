'use client';

import type { ComponentType } from 'react';
import type { FallbackProps } from 'react-error-boundary';

import { createContext, createElement, use } from 'react';

import { ErrorFallback } from '@/components/error-fallback';

import { getCapturedError } from './capture-error';

type FallbackComponent = ComponentType<FallbackProps & { eventId?: string }>;

export const FallbackContext = createContext<FallbackComponent>(ErrorFallback);

export function BoundFallback({ error, resetErrorBoundary }: FallbackProps) {
  const Fallback = use(FallbackContext);
  const captured = getCapturedError(error);

  return createElement(Fallback, {
    error: captured,
    eventId: captured.__sentryEventId,
    resetErrorBoundary,
  });
}
