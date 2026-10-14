import { describe, expect, test } from 'vitest';

import { decideMediaCheck } from './record';

describe('decideMediaCheck', () => {
  test('persists a first observation without a transition', () => {
    expect(
      decideMediaCheck({
        existingStatus: null,
        observedStatus: 'ok',
      })
    ).toEqual({
      isTransition: false,
      persistStatus: 'ok',
    });
    expect(
      decideMediaCheck({
        existingStatus: null,
        observedStatus: 'private',
      })
    ).toEqual({
      isTransition: false,
      persistStatus: 'private',
    });
  });

  test('notifies when ok becomes private', () => {
    expect(
      decideMediaCheck({
        existingStatus: 'ok',
        observedStatus: 'private',
      })
    ).toEqual({
      isTransition: true,
      persistStatus: 'private',
    });
  });

  test('keeps a prior ok when the check is unknown', () => {
    expect(
      decideMediaCheck({
        existingStatus: 'ok',
        observedStatus: 'unknown',
      })
    ).toEqual({
      isTransition: false,
      persistStatus: 'ok',
    });
  });

  test('does not notify when already broken', () => {
    expect(
      decideMediaCheck({
        existingStatus: 'unknown',
        observedStatus: 'private',
      })
    ).toEqual({
      isTransition: false,
      persistStatus: 'private',
    });
    expect(
      decideMediaCheck({
        existingStatus: 'private',
        observedStatus: 'missing',
      })
    ).toEqual({
      isTransition: false,
      persistStatus: 'missing',
    });
  });
});
