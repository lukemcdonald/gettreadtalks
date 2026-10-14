import { describe, expect, test } from 'vitest';

import {
  getTimeSeed,
  rotateContent,
  secondsUntilNextRotation,
} from './rotateContent';

const MS_PER_HOUR = 1000 * 60 * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;

describe('rotateContent', () => {
  test('returns empty when there are no items', () => {
    expect(rotateContent([], { count: 1, period: 'daily' })).toEqual([]);
  });

  test('returns a slice when count covers the list', () => {
    expect(rotateContent(['a', 'b'], { count: 2, period: 'daily' })).toEqual([
      'a',
      'b',
    ]);
  });

  test('same seed yields the same featured item', () => {
    const items = ['a', 'b', 'c', 'd', 'e'];

    expect(rotateContent(items, { count: 1, seed: 10 })).toEqual(
      rotateContent(items, { count: 1, seed: 10 })
    );
  });
});

describe('getTimeSeed', () => {
  test('is the unix-period bucket', () => {
    const now = MS_PER_DAY * 20_000 + 1234;

    expect(getTimeSeed('daily', now)).toBe(20_000);
    expect(getTimeSeed('hourly', now)).toBe(Math.floor(now / MS_PER_HOUR));
    expect(getTimeSeed('weekly', now)).toBe(Math.floor(now / (MS_PER_DAY * 7)));
  });
});

describe('secondsUntilNextRotation', () => {
  test('expires at the period boundary', () => {
    const now = MS_PER_DAY * 20_000 + 1000;

    expect(secondsUntilNextRotation('daily', now)).toBe(
      (MS_PER_DAY - 1000) / 1000
    );
  });
});
