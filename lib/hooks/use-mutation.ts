'use client';

import type { FunctionReference } from 'convex/server';
import type { ErrorWithEventId, MutationState, MutationStatus } from '../services/errors/types';

import { useCallback, useState } from 'react';

import { useMutation as useConvexMutation } from 'convex/react';

import { captureException } from '../services/errors/client';
import { getErrorCode, getErrorMessage } from '../services/errors/convex';

interface UseMutationOptions {
  onError?: (error: Error) => void;
  onSuccess?: (data: unknown) => void;
  reportToSentry?: boolean;
}

export function useMutation<Mutation extends FunctionReference<'mutation'>>(
  mutation: Mutation,
  options: UseMutationOptions = {},
) {
  const { onError, onSuccess, reportToSentry = true } = options;

  const convexMutation = useConvexMutation(mutation);
  const [state, setState] = useState<MutationState>({
    data: null,
    error: null,
    status: 'idle' as MutationStatus,
  });

  const mutate = useCallback(
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

        // Report to Sentry if enabled
        if (reportToSentry) {
          const errorCode = getErrorCode(error);
          // Try to get mutation name from the function reference
          let mutationName = 'unknown-mutation';
          try {
            // FunctionReference might have a path or name property
            if (typeof mutation === 'object' && mutation !== null) {
              const ref = mutation as Record<string, unknown>;
              mutationName = (ref.path as string) || (ref.name as string) || String(mutation);
            } else {
              mutationName = String(mutation);
            }
          } catch {
            mutationName = 'unknown-mutation';
          }
          const eventId = captureException(errorObj, {
            context: {
              mutation: mutationName,
            },
            fingerprint: ['mutation', errorCode.toLowerCase().replace(/_/g, '-')],
            level: 'error',
            tags: {
              errorType: 'mutation',
              errorCode,
            },
          });

          // Store event ID on error object for potential use
          (errorObj as ErrorWithEventId).__sentryEventId = eventId;
        }

        onError?.(errorObj);

        throw errorObj;
      }
    },
    [convexMutation, mutation, onSuccess, onError, reportToSentry],
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      status: 'idle',
    });
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
    reset,
    status: state.status,
  };
}
