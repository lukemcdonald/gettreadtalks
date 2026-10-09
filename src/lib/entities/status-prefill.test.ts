import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { parseStatusPrefill } from './status-prefill.ts';

describe('parseStatusPrefill', () => {
  test('accepts archived', () => {
    assert.equal(parseStatusPrefill('archived'), 'archived');
  });

  test('ignores missing or other values', () => {
    assert.equal(parseStatusPrefill(), undefined);
    assert.equal(parseStatusPrefill(''), undefined);
    assert.equal(parseStatusPrefill('published'), undefined);
  });

  test('uses the first query value', () => {
    assert.equal(parseStatusPrefill(['archived', 'published']), 'archived');
  });
});
