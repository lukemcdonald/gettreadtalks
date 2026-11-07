import { describe, expect, it } from 'vitest';

import {
  formatStudyBackfillCostUsd,
  formatStudyBackfillResultSummary,
  getStudyBackfillErrorMessage,
  getStudyBackfillView,
} from './utils';

const estimate = {
  batch: {
    estimatedCostUsd: 0.06,
    talks: [{}, {}, {}, {}, {}],
  },
  total: {
    eligibleCount: 12,
    estimatedCostUsd: 0.14,
  },
};

describe('formatStudyBackfillCostUsd', () => {
  it('formats a batch cost in USD', () => {
    expect(formatStudyBackfillCostUsd(0.06)).toBe('$0.06');
  });
});

describe('getStudyBackfillErrorMessage', () => {
  it('maps known codes and hides unknown details', () => {
    expect(getStudyBackfillErrorMessage('TOKEN_MISSING')).toBe(
      'Study service is not configured.'
    );
    expect(getStudyBackfillErrorMessage('UPSTREAM_ERROR')).toBe(
      'Study service returned an error.'
    );
    expect(getStudyBackfillErrorMessage('ALREADY_REVIEWED')).toBe(
      'Something went wrong. Please try again.'
    );
    expect(getStudyBackfillErrorMessage()).toBe(
      'Something went wrong. Please try again.'
    );
  });
});

describe('formatStudyBackfillResultSummary', () => {
  it('summarizes generated, skipped, and failed talks', () => {
    expect(
      formatStudyBackfillResultSummary([
        { status: 'success' },
        { status: 'success' },
        { status: 'skipped' },
        { errorCode: 'UPSTREAM_ERROR', status: 'failed' },
      ])
    ).toBe('Generated 2, skipped 1, failed 1.');
  });

  it('returns null when a batch produced no results', () => {
    expect(formatStudyBackfillResultSummary([])).toBeNull();
  });
});

describe('getStudyBackfillView', () => {
  const ready = {
    error: null,
    estimate,
    isAuthenticated: true,
    isAuthLoading: false,
    isPending: false,
    lastResults: null,
  };

  it('waits for the Convex session before querying', () => {
    expect(
      getStudyBackfillView({
        ...ready,
        estimate: undefined,
        isAuthenticated: false,
        isAuthLoading: true,
      })
    ).toMatchObject({
      canGenerate: false,
      showButton: false,
      status: 'Waiting for sign-in.',
    });
  });

  it('does not offer generation until the estimate loads', () => {
    expect(
      getStudyBackfillView({
        ...ready,
        estimate: undefined,
      })
    ).toMatchObject({
      canGenerate: false,
      showButton: false,
      status: 'Checking eligible talks...',
    });
  });

  it('shows eligible count and cost before enabling a batch', () => {
    expect(getStudyBackfillView(ready)).toEqual({
      batchCount: 5,
      buttonLabel: 'Generate 5 study drafts',
      canGenerate: true,
      errorMessage: null,
      resultSummary: null,
      showButton: true,
      status:
        '12 talks need a study draft. This batch of 5 is about $0.06. About $0.14 for all remaining talks.',
    });
  });

  it('blocks a second click while a batch is running', () => {
    expect(
      getStudyBackfillView({
        ...ready,
        isPending: true,
      })
    ).toMatchObject({
      canGenerate: false,
      showButton: true,
      status: 'Generating 5 study drafts...',
    });
  });

  it('hides generation when nothing is eligible', () => {
    expect(
      getStudyBackfillView({
        ...ready,
        estimate: {
          batch: { estimatedCostUsd: 0, talks: [] },
          total: { eligibleCount: 0, estimatedCostUsd: 0 },
        },
        lastResults: [{ status: 'success' }],
      })
    ).toMatchObject({
      canGenerate: false,
      resultSummary: 'Generated 1.',
      showButton: false,
      status: 'No published talks need a study draft.',
    });
  });

  it('keeps skipped talks visible after the cursor pass finishes', () => {
    expect(
      getStudyBackfillView({
        ...ready,
        estimate: {
          batch: { estimatedCostUsd: 0, talks: [] },
          total: { eligibleCount: 2, estimatedCostUsd: 0.02 },
        },
        lastResults: [
          { errorCode: 'UPSTREAM_ERROR', status: 'failed' },
          { status: 'success' },
        ],
      })
    ).toMatchObject({
      canGenerate: false,
      resultSummary: 'Generated 1, failed 1.',
      status: '2 talks still need a study draft. This pass is done.',
    });
  });

  it('keeps the button available after a mapped error so the admin can retry', () => {
    expect(
      getStudyBackfillView({
        ...ready,
        error: 'Study service is not configured.',
      })
    ).toMatchObject({
      canGenerate: true,
      errorMessage: 'Study service is not configured.',
      showButton: true,
    });
  });
});
