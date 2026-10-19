import { describe, expect, it } from 'vitest';

import { decideMediaCheck } from './record';

const CHECKED_AT = 1_700_000_000_000;
const FIRST_BROKEN_AT = 1_699_000_000_000;
const LAST_NOTIFIED_AT = 1_699_500_000_000;

describe('decideMediaCheck', () => {
  it('opens a first broken observation as new', () => {
    expect(
      decideMediaCheck({
        checkedAt: CHECKED_AT,
        existing: null,
        observedStatus: 'private',
      })
    ).toEqual({
      firstBrokenAt: CHECKED_AT,
      persistStatus: 'private',
      state: 'open',
    });
  });

  it('keeps an already open item open', () => {
    expect(
      decideMediaCheck({
        checkedAt: CHECKED_AT,
        existing: {
          firstBrokenAt: FIRST_BROKEN_AT,
          lastNotifiedAt: LAST_NOTIFIED_AT,
          state: 'open',
          status: 'private',
        },
        observedStatus: 'missing',
      })
    ).toEqual({
      firstBrokenAt: FIRST_BROKEN_AT,
      lastNotifiedAt: LAST_NOTIFIED_AT,
      persistStatus: 'missing',
      state: 'open',
    });
  });

  it('reopens a resolved item as new when it breaks again', () => {
    expect(
      decideMediaCheck({
        checkedAt: CHECKED_AT,
        existing: {
          state: 'resolved',
          status: 'ok',
        },
        observedStatus: 'private',
      })
    ).toEqual({
      firstBrokenAt: CHECKED_AT,
      persistStatus: 'private',
      state: 'open',
    });
  });

  it('resolves an open item that is healthy again', () => {
    expect(
      decideMediaCheck({
        checkedAt: CHECKED_AT,
        existing: {
          firstBrokenAt: FIRST_BROKEN_AT,
          lastNotifiedAt: LAST_NOTIFIED_AT,
          state: 'open',
          status: 'private',
        },
        observedStatus: 'ok',
      })
    ).toEqual({
      persistStatus: 'ok',
      state: 'resolved',
    });
  });

  it('leaves ignored items quiet even when they stay broken', () => {
    expect(
      decideMediaCheck({
        checkedAt: CHECKED_AT,
        existing: {
          firstBrokenAt: FIRST_BROKEN_AT,
          lastNotifiedAt: LAST_NOTIFIED_AT,
          state: 'ignored',
          status: 'private',
        },
        observedStatus: 'missing',
      })
    ).toEqual({
      firstBrokenAt: FIRST_BROKEN_AT,
      lastNotifiedAt: LAST_NOTIFIED_AT,
      persistStatus: 'missing',
      state: 'ignored',
    });
  });

  it('keeps a prior ok when the check is unknown', () => {
    expect(
      decideMediaCheck({
        checkedAt: CHECKED_AT,
        existing: {
          state: 'resolved',
          status: 'ok',
        },
        observedStatus: 'unknown',
      })
    ).toEqual({
      persistStatus: 'ok',
      state: 'resolved',
    });
  });
});
