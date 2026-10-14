import { describe, expect, test } from 'vitest';

import { getPublishedAtForStatus, paginateArray, slugify } from './utils';

describe('slugify', () => {
  test('returns empty for missing text', () => {
    expect(slugify(null)).toBe('');
    expect(slugify('')).toBe('');
  });

  test('slugifies a title', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  test('strips punctuation and extra separators', () => {
    expect(slugify('  The Cross: A Study -- Part 1  ')).toBe(
      'the-cross-a-study-part-1'
    );
  });
});

describe('getPublishedAtForStatus', () => {
  test('sets publishedAt when publishing without an existing timestamp', () => {
    const before = Date.now();
    const publishedAt = getPublishedAtForStatus('published');

    expect(publishedAt).toBeGreaterThanOrEqual(before);
    expect(publishedAt).toBeLessThanOrEqual(Date.now());
  });

  test('keeps the existing publishedAt when already published', () => {
    expect(getPublishedAtForStatus('published', 1_700_000_000_000)).toBe(
      1_700_000_000_000
    );
  });

  test('clears publishedAt for a non-published status', () => {
    expect(
      getPublishedAtForStatus('archived', 1_700_000_000_000)
    ).toBeUndefined();
  });
});

describe('paginateArray', () => {
  test('returns the first page and a continuation cursor', () => {
    expect(paginateArray(['a', 'b', 'c'], null, 2)).toEqual({
      continueCursor: '2',
      isDone: false,
      page: ['a', 'b'],
    });
  });

  test('returns the last page and marks done', () => {
    expect(paginateArray(['a', 'b', 'c'], '2', 2)).toEqual({
      continueCursor: '',
      isDone: true,
      page: ['c'],
    });
  });

  test('marks done when the page includes every remaining item', () => {
    expect(paginateArray(['a', 'b'], null, 2)).toEqual({
      continueCursor: '',
      isDone: true,
      page: ['a', 'b'],
    });
  });
});
