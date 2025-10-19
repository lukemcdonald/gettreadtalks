'use client';

import type { FunctionReference } from 'convex/server';
import type { MutationState, MutationStatus } from '../services/errors/types';

import { useCallback, useState } from 'react';

import { useMutation as useConvexMutation } from 'convex/react';

import { captureException } from '../services/errors/client';
import { getErrorMessage } from '../services/errors/convex';

/**
 * Options for useConvexMutation hook.
 */
interface UseMutationOptions {
  /**
   * Callback when mutation succeeds.
   */
  onSuccess?: (data: unknown) => void;

  /**
   * Callback when mutation fails.
   */
  onError?: (error: Error) => void;

  /**
   * Whether to automatically report errors to Sentry.
   * @default true
   */
  reportToSentry?: boolean;
}

/**
 * Enhanced mutation hook with automatic error handling and reporting.
 * Wraps Convex's useMutation with consistent error handling patterns and Sentry integration.
 *
 * Uses a single `status` field ('idle' | 'loading' | 'success' | 'error') as the source of truth,
 * while providing convenient derived boolean flags (isIdle, isLoading, isSuccess, isError).
 *
 * @example
 * // Using status enum
 * const { mutate, status, error } = useMutation(api.talks.create);
 * if (status === 'loading') return <Spinner />;
 *
 * @example
 * // Using derived booleans (convenient for simple checks)
 * const { mutate, isLoading, error } = useMutation(api.talks.create, {
 *   onSuccess: () => toast.success('Created!'),
 * });
 *
 * @example
 * // Switch pattern (cleanest for complex logic)
 * const { mutate, status, data, error } = useMutation(api.talks.create);
 * switch (status) {
 *   case 'idle': return <Form onSubmit={mutate} />;
 *   case 'loading': return <Spinner />;
 *   case 'error': return <Error error={error} />;
 *   case 'success': return <Success data={data} />;
 * }
 */
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
          captureException(errorObj, {
            context: {
              mutation: mutation.toString(),
            },
            level: 'error',
            tags: {
              errorType: 'mutation',
            },
          });
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
