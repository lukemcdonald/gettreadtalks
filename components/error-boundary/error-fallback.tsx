'use client';

import type { FallbackProps } from 'react-error-boundary';

import { useRouter } from 'next/navigation';

/**
 * Default fallback UI shown when an error is caught by ErrorBoundary.
 * Displays a user-friendly error message with a retry button and Sentry Event ID.
 *
 * @example
 * <ErrorBoundary FallbackComponent={ErrorFallback}>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export function ErrorFallback({
  error,
  resetErrorBoundary,
  eventId,
}: FallbackProps & { eventId?: string }) {
  const router = useRouter();

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-8">
      <div className="max-w-md space-y-4 text-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-red-600">Something went wrong</h2>
          <p className="text-gray-600">
            We encountered an unexpected error. This has been reported to our team.
          </p>
          {eventId && (
            <div className="mt-3 rounded-md bg-gray-50 p-3">
              <p className="text-sm text-gray-500">
                Error ID: <span className="font-mono text-gray-700">{eventId}</span>
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Please include this ID when contacting support
              </p>
            </div>
          )}
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 rounded-md bg-gray-100 p-4 text-left">
            <summary className="cursor-pointer font-medium text-gray-700">
              Error Details (Development Only)
            </summary>
            <pre className="mt-2 overflow-auto text-xs text-gray-600">
              {error.message}
              {'\n\n'}
              {error.stack}
            </pre>
          </details>
        )}

        <div className="flex justify-center gap-4">
          <button
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            onClick={resetErrorBoundary}
            type="button"
          >
            Try Again
          </button>
          <button
            className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            onClick={() => router.push('/')}
            type="button"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
