import { describe, expect, test } from 'vitest';

import { normalizeSearchQuery, searchPhrases, uniqueById } from './utils';

describe('normalizeSearchQuery', () => {
  test('trims and collapses whitespace', () => {
    expect(normalizeSearchQuery('  John   Piper  ')).toBe('John Piper');
  });

  test('returns empty for blank input', () => {
    expect(normalizeSearchQuery('   ')).toBe('');
  });
});

describe('searchPhrases', () => {
  test('returns nothing for a blank query', () => {
    expect(searchPhrases('   ')).toEqual([]);
  });

  test('keeps a single token as-is', () => {
    expect(searchPhrases('grace')).toEqual(['grace']);
  });

  test('searches the full name and each token', () => {
    expect(searchPhrases('John Piper')).toEqual([
      'John Piper',
      'John',
      'Piper',
    ]);
  });
});

describe('uniqueById', () => {
  test('keeps first-seen order and drops duplicates', () => {
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
