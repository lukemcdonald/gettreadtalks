import { describe, expect, it } from 'vitest';

import { decideMediaCheck } from './record';

describe('decideMediaCheck', () => {
  it('keeps a prior ok when the check is unknown', () => {
    expect(
      decideMediaCheck({
        checkedAt: 10,
        existing: { status: 'ok' },
        observedStatus: 'unknown',
      })
    ).toEqual({
      persistStatus: 'ok',
    });
  });
});
