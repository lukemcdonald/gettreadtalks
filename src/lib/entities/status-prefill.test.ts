import { describe, expect, test } from 'vitest';

import { parseStatusPrefill } from './status-prefill';

describe('parseStatusPrefill', () => {
  test('accepts archived', () => {
    expect(parseStatusPrefill('archived')).toBe('archived');
  });

  test('ignores missing or other values', () => {
    expect(parseStatusPrefill()).toBe(undefined);
    expect(parseStatusPrefill('')).toBe(undefined);
    expect(parseStatusPrefill('published')).toBe(undefined);
  });

  test('uses the first query value', () => {
    expect(parseStatusPrefill(['archived', 'published'])).toBe('archived');
  });
});
