'use client';

import { useState } from 'react';

import { captureException } from '@/services/errors';

interface GlobalErrorProps {
  error: Error & {
    digest?: string;
  };
}

export default function GlobalError({ error }: GlobalErrorProps) {
  const [eventId] = useState(() => captureException(error, { level: 'fatal' }));

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center font-sans">
        <div className="max-w-sm space-y-2 p-8 text-center">
          <h1 className="font-semibold text-xl">Something went wrong</h1>
          <p className="text-muted-foreground text-sm">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          {eventId && (
            <p className="text-muted-foreground/60 text-xs">
              Event ID: <code>{eventId}</code>
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
