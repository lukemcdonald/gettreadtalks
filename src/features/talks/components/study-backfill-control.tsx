'use client';

import type { StudyBackfillOutcome } from '@/features/talks/components/study-backfill-outcome';
import type { FallbackProps } from 'react-error-boundary';

import { useAction, useConvexAuth, useQuery } from 'convex/react';
import { useRef, useState } from 'react';

import { ErrorBoundary } from '@/components/error-boundary';
import { Button } from '@/components/ui';
import { api } from '@/convex/_generated/api';
import {
  STUDY_BACKFILL_REQUEST_ENDED_MESSAGE,
  formatStudyBackfillResults,
  getStudyBackfillErrorMessage,
  reportStudyBackfillClientFailure,
} from '@/features/talks/components/study-backfill-outcome';
import { USER_ERROR_MESSAGE } from '@/services/errors/user-facing';

const STUDY_BACKFILL_BATCH_LIMIT = 5;

function formatUsd(amount: number) {
  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    maximumFractionDigits: 4,
    minimumFractionDigits: 2,
    style: 'currency',
  }).format(amount);
}

function getStatus({
  batchCount,
  batchCostUsd,
  eligibleCount,
  isPending,
  isReady,
  totalCostUsd,
}: {
  batchCount: number;
  batchCostUsd: number;
  eligibleCount: number;
  isPending: boolean;
  isReady: boolean;
  totalCostUsd: number;
}) {
  if (isPending) {
    return 'Generating...';
  }

  if (!isReady) {
    return 'Checking eligible talks...';
  }

  if (eligibleCount === 0) {
    return 'No published talks need a study draft.';
  }

  if (batchCount === 0) {
    return 'This pass is done.';
  }

  const talks = eligibleCount === 1 ? '1 talk' : `${eligibleCount} talks`;
  const batch = `${talks}. This batch of ${batchCount} is about ${formatUsd(batchCostUsd)}.`;

  if (eligibleCount > batchCount) {
    return `${batch} About ${formatUsd(totalCostUsd)} remaining.`;
  }

  return batch;
}

function StudyBackfillFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      <p>{USER_ERROR_MESSAGE}</p>
      <Button
        onClick={resetErrorBoundary}
        size="sm"
        type="button"
        variant="outline"
      >
        Try again
      </Button>
    </div>
  );
}

export function StudyBackfillControl() {
  const { isAuthenticated } = useConvexAuth();
  const [hasOpened, setHasOpened] = useState(false);

  return (
    <details
      className="text-muted-foreground text-sm"
      data-testid="study-backfill"
      onToggle={(event) => {
        if (event.currentTarget.open) {
          setHasOpened(true);
        }
      }}
    >
      <summary className="cursor-pointer">Study drafts</summary>
      {hasOpened ? (
        <ErrorBoundary fallback={StudyBackfillFallback}>
          {isAuthenticated ? (
            <StudyBackfillPanel />
          ) : (
            <p className="mt-2">Waiting for sign-in.</p>
          )}
        </ErrorBoundary>
      ) : null}
    </details>
  );
}

// fallow-ignore-next-line complexity
function StudyBackfillPanel() {
  const [cursor, setCursor] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [lastResults, setLastResults] = useState<StudyBackfillOutcome[] | null>(
    null
  );
  // ponytail: same-tab duplicate-submit only; reloads/tabs can still overlap
  const inFlight = useRef(false);
  const backfill = useAction(api.talkFeatures.backfillStudies);
  const estimate = useQuery(api.talkFeatures.estimateStudyBackfill, {
    cursor: cursor || undefined,
    limit: STUDY_BACKFILL_BATCH_LIMIT,
  });
  const batchCount = estimate?.batch.talks.length ?? 0;
  const batchCostUsd = estimate?.batch.estimatedCostUsd ?? 0;
  const canGenerate = !isPending && batchCount > 0;
  const results = formatStudyBackfillResults(lastResults);
  const status = getStatus({
    batchCount,
    batchCostUsd,
    eligibleCount: estimate?.total.eligibleCount ?? 0,
    isPending,
    isReady: Boolean(estimate),
    totalCostUsd: estimate?.total.estimatedCostUsd ?? 0,
  });

  async function handleClick() {
    if (inFlight.current || !canGenerate) {
      return;
    }

    const selected = estimate?.batch.talks ?? [];

    inFlight.current = true;
    setLastResults(null);
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
      setError(failed ? getStudyBackfillErrorMessage(failed.errorCode) : null);
    } catch (error_) {
      const failure = reportStudyBackfillClientFailure(error_, selected);

      setLastResults(failure.results);
      setError(failure.message);
    }

    inFlight.current = false;
    setIsPending(false);
  }

  return (
    <div className="mt-2 flex flex-col items-start gap-2">
      {results ? <p data-testid="study-backfill-results">{results}</p> : null}
      <p aria-live="polite" data-testid="study-backfill-status">
        {status}
      </p>
      {error ? (
        <p
          className={
            error === STUDY_BACKFILL_REQUEST_ENDED_MESSAGE
              ? undefined
              : 'text-destructive'
          }
          data-testid="study-backfill-error"
        >
          {error}
        </p>
      ) : null}
      {canGenerate || isPending ? (
        <Button
          data-testid="study-backfill-generate"
          disabled={!canGenerate}
          loading={isPending}
          onClick={handleClick}
          size="sm"
          type="button"
          variant="outline"
        >
          {`Generate ${batchCount} for ${formatUsd(batchCostUsd)}`}
        </Button>
      ) : null}
    </div>
  );
}
