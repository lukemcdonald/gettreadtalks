import { describe, expect, it } from '@/test';

import { decideMediaCheck } from './record';

describe('decideMediaCheck', () => {
  it('persists a first observation without a transition', () => {
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

  it('notifies when ok becomes private', () => {
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

  it('keeps a prior ok when the check is unknown', () => {
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

  it('does not notify when already broken', () => {
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
