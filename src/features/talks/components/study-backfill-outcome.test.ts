import { ConvexError } from 'convex/values';

import { ErrorCodes } from '@/services/errors/constants';
import { USER_ERROR_MESSAGE } from '@/services/errors/user-facing';
import { describe, expect, it } from '@/test';

import {
  STUDY_BACKFILL_REQUEST_ENDED_MESSAGE,
  formatStudyBackfillResults,
  getStudyBackfillErrorMessage,
  reportStudyBackfillClientFailure,
} from './study-backfill-outcome';

const selected = [
  { talkId: 'a', title: 'Eligible A' },
  { talkId: 'b', title: 'Eligible B' },
];

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
    expect(getStudyBackfillErrorMessage()).toBe(USER_ERROR_MESSAGE);
    expect(getStudyBackfillErrorMessage('UPSTREAM_ERROR')).not.toContain(
      'may still be running'
    );
  });
});

describe('reportStudyBackfillClientFailure', () => {
  it('formats auth errors without unknown completion or leftover results', () => {
    const caught = reportStudyBackfillClientFailure(
      new ConvexError({
        errorCode: ErrorCodes.FORBIDDEN,
        message: 'Forbidden',
        statusCode: 403,
      }),
      selected
    );

    expect(caught.message).toBe('Forbidden');
    expect(caught.results).toBeNull();
    expect(caught.message).not.toContain('may still be running');
  });

  it('formats validation errors without unknown completion', () => {
    const caught = reportStudyBackfillClientFailure(
      new Error('ArgumentValidationError: Value does not match validator.'),
      selected
    );

    expect(caught.message).toBe(USER_ERROR_MESSAGE);
    expect(caught.results).toBeNull();
    expect(caught.message).not.toContain('may still be running');
  });

  it('lists selected estimate titles when the request ends without a result', () => {
    const caught = reportStudyBackfillClientFailure(
      new Error('Server Error'),
      selected
    );

    expect(caught.message).toBe(STUDY_BACKFILL_REQUEST_ENDED_MESSAGE);
    expect(caught.message).not.toContain('stops changing');
    expect(caught.results).toEqual([
      { status: 'unknown', talkId: 'a', title: 'Eligible A' },
      { status: 'unknown', talkId: 'b', title: 'Eligible B' },
    ]);
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

  it('labels unconfirmed estimate titles as selected, not generated', () => {
    expect(
      formatStudyBackfillResults([
        { status: 'unknown', talkId: 'a', title: 'Eligible A' },
        { status: 'unknown', talkId: 'b', title: 'Eligible B' },
      ])
    ).toBe('2 selected: Eligible A, Eligible B');
  });
});
