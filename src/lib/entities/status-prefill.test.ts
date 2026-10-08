import assert from 'node:assert/strict';
import { test } from 'node:test';

import { parseStatusPrefill } from './status-prefill.ts';

test('archived is the only accepted status prefill', () => {
  assert.equal(parseStatusPrefill('archived'), 'archived');
});

test('invalid or missing status values are ignored', () => {
  assert.equal(parseStatusPrefill(), undefined);
  assert.equal(parseStatusPrefill(''), undefined);
  assert.equal(parseStatusPrefill('published'), undefined);
  assert.equal(parseStatusPrefill('nope'), undefined);
});

test('duplicate query values use the first archived entry', () => {
  assert.equal(parseStatusPrefill(['archived', 'published']), 'archived');
  assert.equal(parseStatusPrefill(['published']), undefined);
});
