'use client';

import type { FunctionReference } from 'convex/server';
import type { ErrorWithEventId, MutationState, MutationStatus } from '@/services/errors/types';

import { useCallback, useState } from 'react';
import { useMutation as useConvexMutation } from 'convex/react';

import { captureException } from '@/services/errors/client';
import { getErrorMessage, getSentryConfig } from '@/services/errors/convex';

const DEFAULT_STATE: MutationState = {
  data: null,
  error: null,
  status: 'idle' as MutationStatus,
};

export interface UseMutationOptions {
  onError?: (error: Error) => void;
  onSuccess?: (data: unknown) => void;
  reportToSentry?: boolean;
}

export function useMutation<Mutation extends FunctionReference<'mutation'>>(
  mutation: Mutation,
  options: UseMutationOptions = {},
) {
  const convexMutation = useConvexMutation(mutation);
  const [state, setState] = useState<MutationState>(DEFAULT_STATE);

  const { onError, onSuccess, reportToSentry = true } = options;

  const mutateAsync = useCallback(
    async (...args: Parameters<typeof convexMutation>) => {
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
        const errorObj = error instanceof Error ? error : new Error(getErrorMessage(error));

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
    },
    [convexMutation, onSuccess, onError, reportToSentry],
  );

  const mutate = useCallback(
    (...args: Parameters<typeof convexMutation>) => {
      mutateAsync(...args).catch(() => {
        // Error already handled - stored in state and reported to Sentry
      });
    },
    [mutateAsync],
  );

  const reset = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

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
