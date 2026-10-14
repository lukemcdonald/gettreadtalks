import { describe, expect, test } from 'vitest';

import { isMediaCheckStatus } from './validators';

describe('isMediaCheckStatus', () => {
  test('accepts stored media check statuses', () => {
    expect(isMediaCheckStatus('ok')).toBe(true);
    expect(isMediaCheckStatus('private')).toBe(true);
    expect(isMediaCheckStatus('missing')).toBe(true);
    expect(isMediaCheckStatus('unknown')).toBe(true);
  });

  test('rejects an invalid status value', () => {
    expect(isMediaCheckStatus('dead')).toBe(false);
    expect(isMediaCheckStatus(200)).toBe(false);
  });
});
