'use client';

import { useCallback, useState } from 'react';

import { useMutation } from 'convex/react';
import { FunctionReference } from 'convex/server';

import { captureException } from './client';
import { getErrorMessage } from './convex';
import { MutationState } from './types';

/**
 * Options for useMutationWithErrorHandling hook.
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
 * Wraps Convex's useMutation with consistent error handling patterns.
 *
 * @example
 * function CreateTopicForm() {
 *   const { mutate, isLoading, error } = useMutationWithErrorHandling(
 *     api.topics.create,
 *     {
 *       onSuccess: () => toast.success('Topic created!'),
 *       onError: (error) => toast.error(getErrorMessage(error)),
 *     }
 *   );
 *
 *   const handleSubmit = async (data) => {
 *     await mutate(data);
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       {error && <div className="error">{getErrorMessage(error)}</div>}
 *       <button disabled={isLoading}>Create</button>
 *     </form>
 *   );
 * }
 */
export function useMutationWithErrorHandling<Mutation extends FunctionReference<'mutation'>>(
  mutation: Mutation,
  options: UseMutationOptions = {},
) {
  const { onError, onSuccess, reportToSentry = true } = options;

  const convexMutation = useMutation(mutation);
  const [state, setState] = useState<MutationState>({
    data: null,
    error: null,
    isError: false,
    isLoading: false,
    isSuccess: false,
  });

  const mutate = useCallback(
    async (...args: Parameters<typeof convexMutation>) => {
      setState({
        data: null,
        error: null,
        isError: false,
        isLoading: true,
        isSuccess: false,
      });

      try {
        const result = await convexMutation(...args);

        setState({
          data: result,
          error: null,
          isError: false,
          isLoading: false,
          isSuccess: true,
        });

        onSuccess?.(result);

        return result;
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(getErrorMessage(error));

        setState({
          data: null,
          error: errorObj,
          isError: true,
          isLoading: false,
          isSuccess: false,
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
      isError: false,
      isLoading: false,
      isSuccess: false,
    });
  }, []);

  return {
    ...state,
    mutate,
    reset,
  };
}
