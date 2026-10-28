'use client';

import { useState } from 'react';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui';
import { captureException } from '@/services/errors';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AppError({ error, reset }: ErrorProps) {
  // oxlint-disable-next-line react/hook-use-state -- capture once on mount
  const [eventId] = useState(() => captureException(error));

  return (
    <Card className="m-auto w-full max-w-sm">
      <CardHeader>
        <h1 className="font-heading text-lg leading-none font-semibold">
          Something went wrong
        </h1>
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
