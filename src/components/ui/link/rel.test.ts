import assert from 'node:assert/strict';
import { test } from 'node:test';

import { getRel } from './rel.ts';

test('defaults rel for a blank target when none is passed', () => {
  assert.equal(getRel('_blank'), 'noopener noreferrer');
});

test('keeps an explicit rel on a blank target', () => {
  assert.equal(getRel('_blank', 'noreferrer'), 'noreferrer');
});

test('does not default rel when the target is not blank', () => {
  assert.equal(getRel('_self'), undefined);
  assert.equal(getRel(), undefined);
});
