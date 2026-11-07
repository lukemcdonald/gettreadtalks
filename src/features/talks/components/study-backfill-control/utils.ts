export const STUDY_BACKFILL_BATCH_LIMIT = 5;

export interface StudyBackfillEstimate {
  batch: {
    estimatedCostUsd: number;
    talks: readonly unknown[];
  };
  total: {
    eligibleCount: number;
    estimatedCostUsd: number;
  };
}

export interface StudyBackfillResult {
  errorCode?: string;
  status: 'failed' | 'skipped' | 'success';
}

export function formatStudyBackfillCostUsd(amount: number) {
  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    maximumFractionDigits: 4,
    minimumFractionDigits: 2,
    style: 'currency',
  }).format(amount);
}

export function getStudyBackfillErrorMessage(errorCode?: string) {
  if (errorCode === 'TOKEN_MISSING') {
    return 'Study service is not configured.';
  }

  if (errorCode === 'UPSTREAM_ERROR') {
    return 'Study service returned an error.';
  }

  return 'Something went wrong. Please try again.';
}

export function formatStudyBackfillResultSummary(
  results: readonly StudyBackfillResult[]
) {
  let failed = 0;
  let skipped = 0;
  let success = 0;

  for (const result of results) {
    if (result.status === 'failed') {
      failed += 1;
    } else if (result.status === 'skipped') {
      skipped += 1;
    } else {
      success += 1;
    }
  }

  const parts: string[] = [];

  if (success > 0) {
    parts.push(`Generated ${success}`);
  }

  if (skipped > 0) {
    parts.push(`skipped ${skipped}`);
  }

  if (failed > 0) {
    parts.push(`failed ${failed}`);
  }

  if (parts.length === 0) {
    return null;
  }

  const summary = parts.join(', ');

  return `${summary.charAt(0).toUpperCase()}${summary.slice(1)}.`;
}

function getStudyBackfillStatus({
  batchCostUsd,
  batchCount,
  eligibleCount,
  isEstimateLoading,
  isPending,
  isSessionLoading,
  totalCostUsd,
}: {
  batchCostUsd: number;
  batchCount: number;
  eligibleCount: number;
  isEstimateLoading: boolean;
  isPending: boolean;
  isSessionLoading: boolean;
  totalCostUsd: number;
}) {
  if (isPending) {
    return `Generating ${batchCount} study ${batchCount === 1 ? 'draft' : 'drafts'}...`;
  }

  if (isSessionLoading) {
    return 'Waiting for sign-in.';
  }

  if (isEstimateLoading) {
    return 'Checking eligible talks...';
  }

  if (eligibleCount === 0) {
    return 'No published talks need a study draft.';
  }

  if (batchCount === 0) {
    return `${eligibleCount === 1 ? '1 talk still needs' : `${eligibleCount} talks still need`} a study draft. This pass is done.`;
  }

  const batch = `${eligibleCount === 1 ? '1 talk needs' : `${eligibleCount} talks need`} a study draft. This batch of ${batchCount} is about ${formatStudyBackfillCostUsd(batchCostUsd)}.`;

  if (eligibleCount > batchCount) {
    return `${batch} About ${formatStudyBackfillCostUsd(totalCostUsd)} for all remaining talks.`;
  }

  return batch;
}

export function getStudyBackfillView({
  error,
  estimate,
  isAuthenticated,
  isAuthLoading,
  isPending,
  lastResults,
}: {
  error: string | null;
  estimate: StudyBackfillEstimate | undefined;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  isPending: boolean;
  lastResults: readonly StudyBackfillResult[] | null;
}) {
  const batchCount = estimate?.batch.talks.length ?? 0;
  const isSessionLoading = isAuthLoading || !isAuthenticated;
  const canGenerate = !isSessionLoading && !isPending && batchCount > 0;

  return {
    batchCount,
    buttonLabel: `Generate ${batchCount} study ${batchCount === 1 ? 'draft' : 'drafts'}`,
    canGenerate,
    errorMessage: error,
    resultSummary: lastResults
      ? formatStudyBackfillResultSummary(lastResults)
      : null,
    showButton: canGenerate || isPending,
    status: getStudyBackfillStatus({
      batchCostUsd: estimate?.batch.estimatedCostUsd ?? 0,
      batchCount,
      eligibleCount: estimate?.total.eligibleCount ?? 0,
      isEstimateLoading: isAuthenticated && !isAuthLoading && !estimate,
      isPending,
      isSessionLoading,
      totalCostUsd: estimate?.total.estimatedCostUsd ?? 0,
    }),
  };
}
