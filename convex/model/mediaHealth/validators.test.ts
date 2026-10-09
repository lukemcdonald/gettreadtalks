import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { isMediaCheckStatus } from './validators.ts';

describe('isMediaCheckStatus', () => {
  test('accepts stored media check statuses', () => {
    assert.equal(isMediaCheckStatus('ok'), true);
    assert.equal(isMediaCheckStatus('private'), true);
    assert.equal(isMediaCheckStatus('missing'), true);
    assert.equal(isMediaCheckStatus('unknown'), true);
  });

  test('rejects an invalid status value', () => {
    assert.equal(isMediaCheckStatus('dead'), false);
    assert.equal(isMediaCheckStatus(200), false);
  });
});
