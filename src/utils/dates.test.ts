import { describe, expect, it } from '@/test';

import { formatRelativeUpdated } from './dates';

describe('formatRelativeUpdated', () => {
  const now = Date.parse('2026-10-16T12:00:00.000Z');

  it('uses short relative units', () => {
    expect(formatRelativeUpdated(now, now)).toBe('just now');
    expect(formatRelativeUpdated(now - 3 * 60_000, now)).toBe('3m ago');
    expect(formatRelativeUpdated(now - 5 * 60 * 60_000, now)).toBe('5h ago');
    expect(formatRelativeUpdated(now - 3 * 24 * 60 * 60_000, now)).toBe(
      '3d ago'
    );
    expect(formatRelativeUpdated(now - 60 * 24 * 60 * 60_000, now)).toBe(
      '2mo ago'
    );
    expect(formatRelativeUpdated(now - 400 * 24 * 60 * 60_000, now)).toBe(
      '1y ago'
    );
  });
});
