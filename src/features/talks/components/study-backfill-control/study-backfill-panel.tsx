'use client';

import type { StudyBackfillResult } from './utils';

import { useAction, useConvexAuth, useQuery } from 'convex/react';
import { useRef, useState } from 'react';

import { Button, Card, FieldDescription } from '@/components/ui';
import { api } from '@/convex/_generated/api';

import {
  STUDY_BACKFILL_BATCH_LIMIT,
  getStudyBackfillErrorMessage,
  getStudyBackfillView,
} from './utils';

export function StudyBackfillPanel() {
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const [cursor, setCursor] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [lastResults, setLastResults] = useState<StudyBackfillResult[] | null>(
    null
  );
  const inFlight = useRef(false);
  const backfill = useAction(api.talkFeatures.backfillStudies);
  const estimate = useQuery(
    api.talkFeatures.estimateStudyBackfill,
    isAuthenticated
      ? {
          cursor: cursor || undefined,
          limit: STUDY_BACKFILL_BATCH_LIMIT,
        }
      : 'skip'
  );
  const view = getStudyBackfillView({
    error,
    estimate,
    isAuthenticated,
    isAuthLoading,
    isPending,
    lastResults,
  });

  async function handleClick() {
    if (inFlight.current || !view.canGenerate) {
      return;
    }

    inFlight.current = true;
    setError(null);
    setIsPending(true);

    try {
      const result = await backfill({
        cursor: cursor || undefined,
        limit: STUDY_BACKFILL_BATCH_LIMIT,
      });
      const failed = result.results.find((item) => item.status === 'failed');

      setLastResults(result.results);
      setCursor(result.continueCursor);

      if (failed) {
        setError(getStudyBackfillErrorMessage(failed.errorCode));
      }
    } catch {
      setError(getStudyBackfillErrorMessage());
    }

    inFlight.current = false;
    setIsPending(false);
  }

  return (
    <Card className="gap-3 p-4" data-testid="study-backfill">
      <p className="font-medium">Study drafts</p>
      {view.resultSummary ? (
        <FieldDescription data-testid="study-backfill-results">
          {view.resultSummary}
        </FieldDescription>
      ) : null}
      <FieldDescription aria-live="polite" data-testid="study-backfill-status">
        {view.status}
      </FieldDescription>
      {view.errorMessage ? (
        <FieldDescription
          className="text-destructive"
          data-testid="study-backfill-error"
        >
          {view.errorMessage}
        </FieldDescription>
      ) : null}
      {view.showButton ? (
        <Button
          data-testid="study-backfill-generate"
          disabled={!view.canGenerate}
          loading={isPending}
          onClick={handleClick}
          size="sm"
          type="button"
          variant="outline"
        >
          {view.buttonLabel}
        </Button>
      ) : null}
    </Card>
  );
}
