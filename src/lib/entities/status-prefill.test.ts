import { describe, expect, it } from '@/test';

import { parseStatusPrefill } from './status-prefill';

describe('parseStatusPrefill', () => {
  it('accepts archived', () => {
    expect(parseStatusPrefill('archived')).toBe('archived');
  });

  it('ignores missing or other values', () => {
    expect(parseStatusPrefill()).toBe(undefined);
    expect(parseStatusPrefill('')).toBe(undefined);
    expect(parseStatusPrefill('published')).toBe(undefined);
  });

  it('uses the first query value', () => {
    expect(parseStatusPrefill(['archived', 'published'])).toBe('archived');
  });
});
