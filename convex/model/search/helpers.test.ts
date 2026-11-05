import { describe, expect, it } from 'vitest';

import {
  DEFAULT_SEARCH_LIMIT,
  LIST_SEARCH_LIMIT,
  loadAccepted,
  normalizeSearchLimit,
  searchPhrases,
  uniqueById,
} from './helpers';
import { normalizeSearchQuery } from './normalize';

describe('normalizeSearchLimit', () => {
  it('uses the default for missing or non-finite values', () => {
    expect(normalizeSearchLimit(undefined)).toBe(DEFAULT_SEARCH_LIMIT);
    expect(normalizeSearchLimit(Number.NaN)).toBe(DEFAULT_SEARCH_LIMIT);
    expect(normalizeSearchLimit(Number.POSITIVE_INFINITY)).toBe(
      DEFAULT_SEARCH_LIMIT
    );
  });

  it('clamps below one up and above the list cap down', () => {
    expect(normalizeSearchLimit(0)).toBe(1);
    expect(normalizeSearchLimit(-4)).toBe(1);
    expect(normalizeSearchLimit(3.9)).toBe(3);
    expect(normalizeSearchLimit(LIST_SEARCH_LIMIT + 50)).toBe(
      LIST_SEARCH_LIMIT
    );
  });
});

describe('normalizeSearchQuery', () => {
  it('trims and collapses whitespace', () => {
    expect(normalizeSearchQuery('  John   Piper  ')).toBe('John Piper');
  });

  it('returns empty for blank input', () => {
    expect(normalizeSearchQuery('   ')).toBe('');
  });
});

describe('searchPhrases', () => {
  it('returns nothing for a blank query', () => {
    expect(searchPhrases('   ')).toEqual([]);
  });

  it('keeps a single token as-is', () => {
    expect(searchPhrases('grace')).toEqual(['grace']);
  });

  it('searches the full name and each token', () => {
    expect(searchPhrases('John Piper')).toEqual([
      'John Piper',
      'John',
      'Piper',
    ]);
  });
});

describe('loadAccepted', () => {
  async function* numbers() {
    yield* [1, 2, 3, 4, 5];
  }

  it('reads past rejected rows until the page is full', async () => {
    const page = await loadAccepted(numbers(), (value) => value % 2 === 0, 2);

    expect(page).toEqual([2, 4]);
  });

  it('stops when the source ends even if every row was rejected', async () => {
    const page = await loadAccepted(numbers(), (value) => value > 10, 2);

    expect(page).toEqual([]);
  });

  it('returns nothing when the limit is below one', async () => {
    const page = await loadAccepted(numbers(), () => true, 0);

    expect(page).toEqual([]);
  });
});

describe('uniqueById', () => {
  it('keeps first-seen order and drops duplicates', () => {
    expect(
      uniqueById([
        { _id: 'a', title: 'first' },
        { _id: 'b', title: 'second' },
        { _id: 'a', title: 'duplicate' },
      ])
    ).toEqual([
      { _id: 'a', title: 'first' },
      { _id: 'b', title: 'second' },
    ]);
  });
});
