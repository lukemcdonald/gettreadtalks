import { describe, expect, it } from 'vitest';

import { getRel } from './rel';

describe('getRel', () => {
  it('defaults rel for a blank target when none is passed', () => {
    expect(getRel('_blank')).toBe('noopener noreferrer');
  });

  it('keeps an explicit rel on a blank target', () => {
    expect(getRel('_blank', 'noreferrer')).toBe('noreferrer');
  });

  it('does not default rel when the target is not blank', () => {
    expect(getRel('_self')).toBe(undefined);
    expect(getRel()).toBe(undefined);
  });
});
