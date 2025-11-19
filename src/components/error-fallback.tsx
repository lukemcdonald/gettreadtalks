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
          <h2 className="font-semibold text-2xl text-destructive">Something went wrong</h2>
          <p className="text-muted-foreground">
            We encountered an unexpected error. This has been reported to our team.
          </p>
          {eventId && (
            <div className="mt-3 rounded-md bg-muted p-3">
              <p className="text-muted-foreground text-sm">
                Error ID: <span className="font-mono text-foreground">{eventId}</span>
              </p>
              <p className="mt-1 text-muted-foreground text-xs">
                Please include this ID when contacting support
              </p>
            </div>
          )}
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 rounded-md bg-muted p-4 text-left">
            <summary className="cursor-pointer font-semibold text-foreground">
              Error Details (Development Only)
            </summary>
            <pre className="mt-2 overflow-auto text-muted-foreground text-xs">
              {error.message}
              {'\n\n'}
              {error.stack}
            </pre>
          </details>
        )}

        <div className="flex justify-center gap-4">
          <button
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            onClick={resetErrorBoundary}
            type="button"
          >
            Try Again
          </button>
          <button
            className="rounded-md border border-border px-4 py-2 text-foreground hover:bg-accent"
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
