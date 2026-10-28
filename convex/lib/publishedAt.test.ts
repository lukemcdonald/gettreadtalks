import { describe, expect, it } from 'vitest';

import {
  formatUtcDate,
  isFuturePublishedAt,
  isFutureUtcDate,
  parseUtcDate,
  resolvePublishedAt,
} from './publishedAt';

const NOW = Date.parse('2026-10-28T15:30:00.000Z');

describe('formatUtcDate', () => {
  it('returns the UTC calendar date', () => {
    expect(formatUtcDate(Date.parse('2024-06-03T12:00:00.000Z'))).toBe(
      '2024-06-03'
    );
    expect(formatUtcDate(Date.parse('2024-06-03T23:30:00.000Z'))).toBe(
      '2024-06-03'
    );
  });
});

describe('parseUtcDate', () => {
  it('parses a valid UTC date to midnight', () => {
    expect(parseUtcDate('2020-01-15')).toBe(
      Date.parse('2020-01-15T00:00:00.000Z')
    );
  });

  it('rejects empty, malformed, and overflow dates', () => {
    expect(parseUtcDate('')).toBeUndefined();
    expect(parseUtcDate('2020-1-15')).toBeUndefined();
    expect(parseUtcDate('2024-02-30')).toBeUndefined();
    expect(parseUtcDate('not-a-date')).toBeUndefined();
  });
});

describe('isFutureUtcDate', () => {
  it('treats today as allowed and later calendar days as future', () => {
    expect(isFutureUtcDate('2026-10-28', NOW)).toBe(false);
    expect(isFutureUtcDate('2026-10-27', NOW)).toBe(false);
    expect(isFutureUtcDate('2026-10-29', NOW)).toBe(true);
  });
});

describe('isFuturePublishedAt', () => {
  it('uses the UTC calendar date, not the time of day', () => {
    expect(
      isFuturePublishedAt(Date.parse('2026-10-28T23:59:00.000Z'), NOW)
    ).toBe(false);
    expect(
      isFuturePublishedAt(Date.parse('2026-10-29T00:00:00.000Z'), NOW)
    ).toBe(true);
  });
});

describe('resolvePublishedAt', () => {
  it('clears the timestamp when the talk is not published', () => {
    expect(
      resolvePublishedAt({
        currentPublishedAt: NOW,
        requestedPublishedAt: Date.parse('2020-01-01T00:00:00.000Z'),
        status: 'backlog',
      })
    ).toBeUndefined();
  });

  it('defaults to now when first publishing without a date', () => {
    expect(
      resolvePublishedAt({
        now: NOW,
        status: 'published',
      })
    ).toBe(NOW);
  });

  it('keeps the existing timestamp when republishing without a date', () => {
    const currentPublishedAt = Date.parse('2024-06-03T12:00:00.000Z');

    expect(
      resolvePublishedAt({
        currentPublishedAt,
        now: NOW,
        status: 'published',
      })
    ).toBe(currentPublishedAt);
  });

  it('keeps the existing time when the requested date is the same UTC day', () => {
    const currentPublishedAt = Date.parse('2024-06-03T12:00:00.000Z');

    expect(
      resolvePublishedAt({
        currentPublishedAt,
        requestedPublishedAt: Date.parse('2024-06-03T00:00:00.000Z'),
        status: 'published',
      })
    ).toBe(currentPublishedAt);
  });

  it('uses the requested timestamp when the date changes', () => {
    const requestedPublishedAt = Date.parse('2020-01-01T00:00:00.000Z');

    expect(
      resolvePublishedAt({
        currentPublishedAt: Date.parse('2024-06-03T12:00:00.000Z'),
        requestedPublishedAt,
        status: 'published',
      })
    ).toBe(requestedPublishedAt);
  });
});
