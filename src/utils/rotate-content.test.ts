import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  getTimeSeed,
  rotateContent,
  secondsUntilNextRotation,
} from '../../convex/lib/rotateContent.ts';

const MS_PER_HOUR = 1000 * 60 * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;

test('returns empty when there are no items', () => {
  assert.deepEqual(rotateContent([], { count: 1, period: 'daily' }), []);
});

test('returns a slice when count covers the list', () => {
  assert.deepEqual(rotateContent(['a', 'b'], { count: 2, period: 'daily' }), [
    'a',
    'b',
  ]);
});

test('same seed yields the same featured item', () => {
  const items = ['a', 'b', 'c', 'd', 'e'];
  const first = rotateContent(items, { count: 1, seed: 10 });
  const second = rotateContent(items, { count: 1, seed: 10 });

  assert.deepEqual(first, second);
});

test('getTimeSeed is the unix-period bucket', () => {
  const now = MS_PER_DAY * 20_000 + 1234;

  assert.equal(getTimeSeed('daily', now), 20_000);
  assert.equal(getTimeSeed('hourly', now), Math.floor(now / MS_PER_HOUR));
});

test('secondsUntilNextRotation expires at the period boundary', () => {
  const now = MS_PER_DAY * 20_000 + 1000;

  assert.equal(
    secondsUntilNextRotation('daily', now),
    (MS_PER_DAY - 1000) / 1000
  );
});
