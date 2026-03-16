'use client';

import { useState } from 'react';

import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  Separator,
} from '@/components/ui';
import { captureException } from '@/services/errors';

interface AccountErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AccountError({ error, reset }: AccountErrorProps) {
  const [eventId] = useState(() => captureException(error));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Error</CardTitle>
      </CardHeader>

      <Separator />

      <div className="p-6">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Something went wrong</EmptyTitle>
            <EmptyDescription>
              {eventId ? `Event ID: ${eventId}` : 'An unexpected error occurred.'}
            </EmptyDescription>
          </EmptyHeader>
          <Button onClick={reset} variant="outline">
            Try again
          </Button>
        </Empty>
      </div>
    </Card>
  );
}
