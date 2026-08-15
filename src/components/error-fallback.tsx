'use client';

import type { ErrorWithEventId } from '@/services/errors/types';
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
  eventId: eventIdProp,
  resetErrorBoundary,
}: FallbackProps & { eventId?: string }) {
  const eventId = eventIdProp ?? (error as ErrorWithEventId).__sentryEventId;
  const router = useRouter();

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-8">
      <div className="max-w-md space-y-4 text-center">
        <div className="space-y-2">
          <h2 className="text-destructive text-2xl font-semibold">
            Something went wrong
          </h2>
          <p className="text-muted-foreground">
            We encountered an unexpected error. This has been reported to our
            team.
          </p>
          {!!eventId && (
            <div className="bg-muted mt-3 rounded-md p-3">
              <p className="text-muted-foreground text-sm">
                Error ID:{' '}
                <span className="text-foreground font-mono">{eventId}</span>
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                Please include this ID when contacting support
              </p>
            </div>
          )}
        </div>

        {process.env.NODE_ENV === 'development' && error instanceof Error && (
          <details className="bg-muted mt-4 rounded-md p-4 text-left">
            <summary className="text-foreground cursor-pointer font-semibold">
              Error Details (Development Only)
            </summary>
            <pre className="text-muted-foreground mt-2 overflow-auto text-xs">
              {error.message}
              {'\n\n'}
              {error.stack}
            </pre>
          </details>
        )}

        <div className="flex justify-center gap-4">
          <button
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2"
            onClick={resetErrorBoundary}
            type="button"
          >
            Try Again
          </button>
          <button
            className="border-border text-foreground hover:bg-accent rounded-md border px-4 py-2"
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
