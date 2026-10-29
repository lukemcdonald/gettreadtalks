import { describe, expect, it } from 'vitest';

import {
  getPublishedAtForStatus,
  paginateArray,
  paginateSearchOrList,
  slugify,
} from './utils';

describe('slugify', () => {
  it('returns empty for missing text', () => {
    expect(slugify(null)).toBe('');
    expect(slugify('')).toBe('');
  });

  it('slugifies a title', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('strips punctuation and extra separators', () => {
    expect(slugify('  The Cross: A Study -- Part 1  ')).toBe(
      'the-cross-a-study-part-1'
    );
  });
});

describe('getPublishedAtForStatus', () => {
  it('sets publishedAt when publishing without an existing timestamp', () => {
    const before = Date.now();
    const publishedAt = getPublishedAtForStatus('published');

    expect(publishedAt).toBeGreaterThanOrEqual(before);
    expect(publishedAt).toBeLessThanOrEqual(Date.now());
  });

  it('keeps the existing publishedAt when already published', () => {
    expect(getPublishedAtForStatus('published', 1_700_000_000_000)).toBe(
      1_700_000_000_000
    );
  });

  it('clears publishedAt for a non-published status', () => {
    expect(
      getPublishedAtForStatus('archived', 1_700_000_000_000)
    ).toBeUndefined();
  });
});

describe('paginateArray', () => {
  it('returns the first page and a continuation cursor', () => {
    expect(paginateArray(['a', 'b', 'c'], null, 2)).toEqual({
      continueCursor: '2',
      isDone: false,
      page: ['a', 'b'],
    });
  });

  it('returns the last page and marks done', () => {
    expect(paginateArray(['a', 'b', 'c'], '2', 2)).toEqual({
      continueCursor: '',
      isDone: true,
      page: ['c'],
    });
  });

  it('marks done when the page includes every remaining item', () => {
    expect(paginateArray(['a', 'b'], null, 2)).toEqual({
      continueCursor: '',
      isDone: true,
      page: ['a', 'b'],
    });
  });
});

describe('paginateSearchOrList', () => {
  it('uses search with cursor pages, and lists when the query is empty', async () => {
    const listed = {
      continueCursor: 'listed',
      isDone: false,
      page: ['listed'],
    };
    const items = ['a', 'b', 'c'];

    const first = await paginateSearchOrList({
      listPage: () => Promise.resolve(listed),
      paginationOpts: {
        cursor: null,
        numItems: 2,
      },
      queryText: 'grace',
      search: () => Promise.resolve(items),
    });

    expect(first).toEqual({
      continueCursor: '2',
      isDone: false,
      page: ['a', 'b'],
    });

    const second = await paginateSearchOrList({
      listPage: () => Promise.resolve(listed),
      paginationOpts: {
        cursor: first.continueCursor,
        numItems: 2,
      },
      queryText: 'grace',
      search: () => Promise.resolve(items),
    });

    expect(second).toEqual({
      continueCursor: '',
      isDone: true,
      page: ['c'],
    });

    const unfiltered = await paginateSearchOrList({
      listPage: () => Promise.resolve(listed),
      paginationOpts: {
        cursor: null,
        numItems: 2,
      },
      queryText: '',
      search: () => Promise.resolve(items),
    });

    expect(unfiltered).toBe(listed);
  });
});
