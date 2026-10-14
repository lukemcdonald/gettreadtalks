import { describe, expect, test } from 'vitest';

import { getRel } from './rel';

describe('getRel', () => {
  test('defaults rel for a blank target when none is passed', () => {
    expect(getRel('_blank')).toBe('noopener noreferrer');
  });

  test('keeps an explicit rel on a blank target', () => {
    expect(getRel('_blank', 'noreferrer')).toBe('noreferrer');
  });

  test('does not default rel when the target is not blank', () => {
    expect(getRel('_self')).toBe(undefined);
    expect(getRel()).toBe(undefined);
  });
});
