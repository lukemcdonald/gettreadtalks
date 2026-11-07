import { describe, expect, it } from 'vitest';

import { rotateContent, secondsUntilNextRotation } from './rotateContent';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

describe('rotateContent', () => {
  it('returns empty when there are no items', () => {
    expect(rotateContent([], { count: 1, period: 'daily' })).toEqual([]);
  });

  it('returns a slice when count covers the list', () => {
    expect(rotateContent(['a', 'b'], { count: 2, period: 'daily' })).toEqual([
      'a',
      'b',
    ]);
  });

  it('same seed yields the same featured item', () => {
    const items = ['a', 'b', 'c', 'd', 'e'];

    expect(rotateContent(items, { count: 1, seed: 10 })).toEqual(
      rotateContent(items, { count: 1, seed: 10 })
    );
  });

  it('different seeds change the selection', () => {
    const items = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    expect(rotateContent(items, { count: 3, seed: 11 })).not.toEqual(
      rotateContent(items, { count: 3, seed: 12 })
    );
  });

  it('does not drop items when the seed is negative', () => {
    const items = Array.from({ length: 50 }, (_, index) => index);
    const rotated = rotateContent(items, { count: 25, seed: -1000 });

    expect(rotated).toHaveLength(25);
    expect(rotated.every((item) => typeof item === 'number')).toBe(true);
    expect(new Set(rotated).size).toBe(25);
  });
});

describe('secondsUntilNextRotation', () => {
  it('expires at the period boundary', () => {
    const now = MS_PER_DAY * 20_000 + 1000;

    expect(secondsUntilNextRotation('daily', now)).toBe(
      (MS_PER_DAY - 1000) / 1000
    );
  });
});
