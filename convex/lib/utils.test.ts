import { describe, expect, it } from 'vitest';

import {
  getPublishedAtForStatus,
  loadFullPage,
  loadUntilFull,
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

describe('loadFullPage', () => {
  function pageOf(items: string[]) {
    return (opts: { cursor: string | null; numItems: number }) =>
      Promise.resolve(paginateArray(items, opts.cursor, opts.numItems));
  }

  it('reads past rejected rows until the page is full', async () => {
    const items = ['drop', 'keep-a', 'drop', 'keep-b', 'keep-c'];
    const accept = (rows: string[]) =>
      rows.filter((row) => row.startsWith('keep'));
    const first = await loadFullPage(pageOf(items), accept, {
      cursor: null,
      numItems: 2,
    });

    expect(first.page).toEqual(['keep-a', 'keep-b']);
    expect(first.isDone).toBe(false);

    const second = await loadFullPage(pageOf(items), accept, {
      cursor: first.continueCursor,
      numItems: 2,
    });

    expect(second).toEqual({
      continueCursor: '',
      isDone: true,
      page: ['keep-c'],
    });
  });

  it('follows the cursor when one read cannot hold the requested rows', async () => {
    const items = Array.from({ length: 1001 }, (_, index) => String(index));
    let reads = 0;
    const result = await loadFullPage(
      (opts) => {
        reads += 1;

        expect(opts.numItems).toBeLessThanOrEqual(1000);
        expect(Number.isFinite(opts.numItems)).toBe(true);

        return Promise.resolve(
          paginateArray(items, opts.cursor, opts.numItems)
        );
      },
      (rows) => rows,
      {
        cursor: null,
        numItems: Number.POSITIVE_INFINITY,
      }
    );

    expect(reads).toBeGreaterThan(1);
    expect(result.isDone).toBe(true);
    expect(result.page).toEqual(items);
  });

  it('reads an unbounded list past the single-page cap', async () => {
    const total = 51;
    let reads = 0;
    const result = await loadFullPage(
      () => {
        reads += 1;
        const isDone = reads === total;

        return Promise.resolve({
          continueCursor: isDone ? '' : `page-${reads}`,
          isDone,
          page: [String(reads)],
        });
      },
      (rows) => rows,
      {
        cursor: null,
        numItems: Number.POSITIVE_INFINITY,
      }
    );

    expect(reads).toBe(total);
    expect(result.isDone).toBe(true);
    expect(result.page).toHaveLength(total);
  });

  it('reads the next page when a filtered page is empty', async () => {
    let reads = 0;
    const result = await loadFullPage(
      (opts) => {
        reads += 1;

        if (reads === 1) {
          expect(opts).toMatchObject({
            cursor: null,
            maximumBytesRead: 2048,
            numItems: 1,
          });

          return Promise.resolve({
            continueCursor: 'next',
            isDone: false,
            page: [],
          });
        }

        return Promise.resolve({
          continueCursor: '',
          isDone: true,
          page: ['keep'],
        });
      },
      (rows) => rows,
      {
        cursor: null,
        maximumBytesRead: 2048,
        numItems: 1,
      }
    );

    expect(result).toEqual({
      continueCursor: '',
      isDone: true,
      page: ['keep'],
    });
  });

  it('keeps a later page when filtering empties the scanned rows', async () => {
    const seen: { cursor: string | null; maximumBytesRead?: number }[] = [];
    const result = await loadFullPage(
      (opts) => {
        seen.push(opts);

        return Promise.resolve({
          continueCursor: `page-${seen.length}`,
          isDone: false,
          page: ['hidden'],
        });
      },
      () => [],
      {
        cursor: null,
        maximumBytesRead: 2048,
        numItems: 3,
      }
    );

    expect(seen[0]).toMatchObject({
      cursor: null,
      maximumBytesRead: 2048,
      numItems: 3,
    });
    expect(seen[1]).toMatchObject({
      cursor: 'page-1',
      maximumBytesRead: 2048,
    });
    expect(result.page).toEqual([]);
    expect(result.isDone).toBe(false);
    expect(result.continueCursor).toBe(`page-${seen.length}`);
  });

  it('ends when the source is done even if every row was rejected', async () => {
    const result = await loadFullPage(
      pageOf(['drop', 'drop']),
      (rows) => rows.filter((row) => row === 'keep'),
      {
        cursor: null,
        numItems: 2,
      }
    );

    expect(result).toEqual({
      continueCursor: '',
      isDone: true,
      page: [],
    });
  });
});

describe('loadUntilFull', () => {
  async function* numbers() {
    yield* [1, 2, 3, 4, 5];
  }

  it('reads past rejected rows until the page is full', async () => {
    const page = await loadUntilFull(numbers(), (value) => value % 2 === 0, 2);

    expect(page).toEqual([2, 4]);
  });

  it('stops when the source ends even if every row was rejected', async () => {
    const page = await loadUntilFull(numbers(), (value) => value > 10, 2);

    expect(page).toEqual([]);
  });

  it('returns nothing when the limit is below one', async () => {
    const page = await loadUntilFull(numbers(), () => true, 0);

    expect(page).toEqual([]);
  });
});
