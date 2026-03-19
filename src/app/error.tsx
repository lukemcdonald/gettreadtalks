'use client';

import { useEffect, useState } from 'react';

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { captureException } from '@/services/errors';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AppError({ error, reset }: ErrorProps) {
  const [eventId, setEventId] = useState<string | undefined>();

  useEffect(() => {
    setEventId(captureException(error));
  }, [error]);

  return (
    <Card className="m-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>Something went wrong</CardTitle>
        <CardDescription>
          {eventId ? `Event ID: ${eventId}` : 'An unexpected error occurred.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={reset} variant="outline">
          Try again
        </Button>
      </CardContent>
    </Card>
  );
}
