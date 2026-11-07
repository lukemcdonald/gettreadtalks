import type * as ErrorService from '@/services/errors';

import { ConvexError } from 'convex/values';
import { vi } from 'vitest';

import { captureException, reportUnexpectedError } from '@/services/errors';
import { ErrorCodes } from '@/services/errors/constants';
import { USER_ERROR_MESSAGE } from '@/services/errors/user-facing';
import { afterEach, describe, expect, it } from '@/test';

import {
  STUDY_BACKFILL_REQUEST_ENDED_MESSAGE,
  formatStudyBackfillResults,
  getStudyBackfillErrorMessage,
  getStudyBackfillRequestFailure,
  reportStudyBackfillClientFailure,
  runStudyBackfillRequest,
  toStudyBackfillUnknownResults,
} from './study-backfill-outcome';

vi.mock('@/services/errors', async (importOriginal) => {
  const actual = await importOriginal<typeof ErrorService>();

  return {
    ...actual,
    captureException: vi.fn(),
    reportUnexpectedError: vi.fn(),
  };
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('getStudyBackfillErrorMessage', () => {
  it('maps confirmed service failures and keeps server errors generic', () => {
    expect(getStudyBackfillErrorMessage('TOKEN_MISSING')).toBe(
      'Study service is not configured.'
    );
    expect(getStudyBackfillErrorMessage('UPSTREAM_ERROR')).toBe(
      'Study service returned an error.'
    );
    expect(getStudyBackfillErrorMessage('NO_TRANSCRIPT_SOURCE')).toBe(
      'Generating needs a YouTube video.'
    );
    expect(getStudyBackfillErrorMessage(ErrorCodes.SERVER_ERROR)).toBe(
      USER_ERROR_MESSAGE
    );
    expect(getStudyBackfillErrorMessage(ErrorCodes.UNKNOWN_ERROR)).toBe(
      USER_ERROR_MESSAGE
    );
    expect(getStudyBackfillErrorMessage()).toBe(USER_ERROR_MESSAGE);
  });

  it('does not treat confirmed failures as in-flight work', () => {
    expect(getStudyBackfillErrorMessage('UPSTREAM_ERROR')).not.toContain(
      'may still be running'
    );
    expect(getStudyBackfillErrorMessage('TOKEN_MISSING')).not.toContain(
      'Wait until the remaining count'
    );
    expect(getStudyBackfillErrorMessage(ErrorCodes.SERVER_ERROR)).not.toContain(
      'may still be running'
    );
  });
});

describe('getStudyBackfillRequestFailure', () => {
  it('uses NETWORK_ERROR only when the Convex client reports connection loss', () => {
    const lost = getStudyBackfillRequestFailure(
      new Error(
        '[CONVEX A(talkFeatures:backfillStudies)] Connection lost while action was in flight\n  Called by client'
      )
    );

    expect(lost).toEqual({
      errorCode: ErrorCodes.NETWORK_ERROR,
      message: STUDY_BACKFILL_REQUEST_ENDED_MESSAGE,
    });
  });

  it('does not assert disconnect for other request failures', () => {
    const failed = getStudyBackfillRequestFailure(new Error('Server Error'));

    expect(failed.errorCode).toBe(ErrorCodes.UNKNOWN_ERROR);
    expect(failed.message).toBe(STUDY_BACKFILL_REQUEST_ENDED_MESSAGE);
    expect(failed.message).toContain('may still be running');
    expect(failed.message).toContain(
      'Wait until the remaining count stops changing before generating again'
    );
  });
});

describe('reportStudyBackfillClientFailure', () => {
  const attempted = [
    { talkId: 'a', title: 'Eligible A' },
    { talkId: 'b', title: 'Eligible B' },
  ];

  it('keeps Convex application errors confirmed and does not mark talks unknown', () => {
    const caught = reportStudyBackfillClientFailure(
      new ConvexError({
        errorCode: ErrorCodes.FORBIDDEN,
        message: 'Forbidden',
        statusCode: 403,
      }),
      attempted
    );

    expect(caught.message).toBe('Forbidden');
    expect(caught.results).toBeNull();
    expect(captureException).not.toHaveBeenCalled();
    expect(reportUnexpectedError).not.toHaveBeenCalled();
  });

  it('captures unexpected Convex errors through getSentryConfig', () => {
    const error = new ConvexError({
      errorCode: ErrorCodes.SERVER_ERROR,
      message: 'Database write failed',
      statusCode: 500,
    });
    const caught = reportStudyBackfillClientFailure(error, attempted);

    expect(caught.message).toBe('Database write failed');
    expect(caught.results).toBeNull();
    expect(captureException).toHaveBeenCalledTimes(1);
    expect(captureException).toHaveBeenCalledWith(
      error,
      expect.objectContaining({
        tags: expect.objectContaining({
          errorCode: ErrorCodes.SERVER_ERROR,
          operation: 'backfillStudies',
        }),
      })
    );
    expect(reportUnexpectedError).not.toHaveBeenCalled();
  });

  it('reports request-ended failures once through reportUnexpectedError', () => {
    const error = new Error('Server Error');
    const caught = reportStudyBackfillClientFailure(error, attempted);

    expect(caught.message).toBe(STUDY_BACKFILL_REQUEST_ENDED_MESSAGE);
    expect(caught.results).toEqual(toStudyBackfillUnknownResults(attempted));
    expect(reportUnexpectedError).toHaveBeenCalledTimes(1);
    expect(reportUnexpectedError).toHaveBeenCalledWith(
      error,
      expect.objectContaining({
        fingerprint: ['error', 'backfillStudies', ErrorCodes.UNKNOWN_ERROR],
        tags: {
          attemptedCount: '2',
          errorCode: ErrorCodes.UNKNOWN_ERROR,
          operation: 'backfillStudies',
        },
      })
    );
    expect(captureException).not.toHaveBeenCalled();
  });
});

describe('runStudyBackfillRequest', () => {
  const attempted = [
    { talkId: 'a', title: 'Eligible A' },
    { talkId: 'b', title: 'Eligible B' },
  ];

  it('returns confirmed results without reporting when the action resolves', async () => {
    const results = [
      { status: 'success' as const, talkId: 'a', title: 'Eligible A' },
      {
        errorCode: 'UPSTREAM_ERROR',
        status: 'failed' as const,
        talkId: 'b',
        title: 'Eligible B',
      },
    ];

    await expect(
      runStudyBackfillRequest({
        attempted,
        backfill: () =>
          Promise.resolve({
            continueCursor: 'b',
            results,
          }),
        cursor: '',
        limit: 5,
      })
    ).resolves.toEqual({
      continueCursor: 'b',
      error: 'Study service returned an error.',
      results,
    });
    expect(captureException).not.toHaveBeenCalled();
    expect(reportUnexpectedError).not.toHaveBeenCalled();
  });

  it('marks attempted talks unknown when the request ends without a result', async () => {
    await expect(
      runStudyBackfillRequest({
        attempted,
        backfill: () => Promise.reject(new Error('Server Error')),
        cursor: '',
        limit: 5,
      })
    ).resolves.toEqual({
      error: STUDY_BACKFILL_REQUEST_ENDED_MESSAGE,
      results: toStudyBackfillUnknownResults(attempted),
    });
    expect(reportUnexpectedError).toHaveBeenCalledTimes(1);
    expect(captureException).not.toHaveBeenCalled();
  });
});

describe('formatStudyBackfillResults', () => {
  it('lists confirmed mixed outcomes by title', () => {
    expect(
      formatStudyBackfillResults([
        {
          status: 'success',
          talkId: 'a',
          title: 'Eligible A',
        },
        {
          errorCode: 'UPSTREAM_ERROR',
          status: 'failed',
          talkId: 'b',
          title: 'Eligible B',
        },
        {
          errorCode: 'ALREADY_REVIEWED',
          status: 'skipped',
          talkId: 'c',
          title: 'Eligible C',
        },
      ])
    ).toBe(
      '1 generated: Eligible A. 1 skipped: Eligible C. 1 failed: Eligible B'
    );
  });

  it('does not label unconfirmed attempts as generated', () => {
    expect(
      formatStudyBackfillResults(
        toStudyBackfillUnknownResults([
          { talkId: 'a', title: 'Eligible A' },
          { talkId: 'b', title: 'Eligible B' },
        ])
      )
    ).toBe('2 unknown: Eligible A, Eligible B');
  });
});
