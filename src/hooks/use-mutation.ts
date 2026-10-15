'use client';

import type {
  ErrorWithEventId,
  MutationState,
  MutationStatus,
} from '@/services/errors/types';
import type { FunctionReference } from 'convex/server';

import { useMutation as useConvexMutation } from 'convex/react';
import { useState } from 'react';

import { captureException } from '@/services/errors';
import { getSentryConfig } from '@/services/errors/convex';

const DEFAULT_STATE: MutationState = {
  data: null,
  error: null,
  status: 'idle' as MutationStatus,
};

function toError(error: unknown): Error {
  if (typeof error === 'string') {
    return new Error(error);
  }

  return new Error('Unknown error');
}

export interface UseMutationOptions {
  onError?: (error: Error) => void;
  onSuccess?: (data: unknown) => void;
  reportToSentry?: boolean;
}

export function useMutation<Mutation extends FunctionReference<'mutation'>>(
  mutation: Mutation,
  options: UseMutationOptions = {}
) {
  const convexMutation = useConvexMutation(mutation);
  const [state, setState] = useState<MutationState>(DEFAULT_STATE);

  const { onError, onSuccess, reportToSentry = true } = options;

  async function mutateAsync(...args: Parameters<typeof convexMutation>) {
    setState((prev) => ({
      ...prev,
      error: null,
      status: 'loading',
    }));

    try {
      const result = await convexMutation(...args);

      setState({
        data: result,
        error: null,
        status: 'success',
      });

      onSuccess?.(result);

      return result;
    } catch (error) {
      const errorObj = error instanceof Error ? error : toError(error);

      setState({
        data: null,
        error: errorObj,
        status: 'error',
      });

      // Report to Sentry if enabled and error should be logged
      const sentryConfig = getSentryConfig(error);

      if (reportToSentry && sentryConfig.shouldLog) {
        const eventId = captureException(errorObj, {
          context: sentryConfig.context,
          fingerprint: sentryConfig.fingerprint,
          level: sentryConfig.level,
          tags: { ...sentryConfig.tags, errorType: 'mutation' },
        });

        // Store event ID on error object for potential use
        (errorObj as ErrorWithEventId).__sentryEventId = eventId;
      }

      onError?.(errorObj);

      throw errorObj;
    }
  }

  function mutate(...args: Parameters<typeof convexMutation>) {
    mutateAsync(...args).catch(() => {
      // Error already handled - stored in state and reported to Sentry
    });
  }

  function reset() {
    setState(DEFAULT_STATE);
  }

  // Return state with derived boolean flags for convenience
  return {
    data: state.data,
    error: state.error,
    isError: state.status === 'error',
    isIdle: state.status === 'idle',
    isLoading: state.status === 'loading',
    isSuccess: state.status === 'success',
    mutate,
    mutateAsync,
    reset,
    status: state.status,
  };
}
