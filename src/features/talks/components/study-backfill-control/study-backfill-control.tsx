'use client';

import type { FallbackProps } from 'react-error-boundary';

import dynamic from 'next/dynamic';

import { ErrorBoundary } from '@/components/error-boundary';
import { Button, Card, FieldDescription } from '@/components/ui';

import { getStudyBackfillErrorMessage } from './utils';

const StudyBackfillPanel = dynamic(
  () =>
    import('./study-backfill-panel').then(
      (module) => module.StudyBackfillPanel
    ),
  { ssr: false }
);

function StudyBackfillFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <Card className="gap-3 p-4">
      <p className="font-medium">Study drafts</p>
      <FieldDescription>{getStudyBackfillErrorMessage()}</FieldDescription>
      <Button
        onClick={resetErrorBoundary}
        size="sm"
        type="button"
        variant="outline"
      >
        Try again
      </Button>
    </Card>
  );
}

export function StudyBackfillControl() {
  return (
    <ErrorBoundary fallback={StudyBackfillFallback}>
      <StudyBackfillPanel />
    </ErrorBoundary>
  );
}
