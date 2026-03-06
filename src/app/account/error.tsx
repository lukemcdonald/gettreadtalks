'use client';

import { useEffect } from 'react';

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

interface AccountErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AccountError({ error, reset }: AccountErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

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
              {error.digest ? `Error ID: ${error.digest}` : 'An unexpected error occurred.'}
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
