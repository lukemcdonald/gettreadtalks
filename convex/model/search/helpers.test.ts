import { describe, expect, it } from 'vitest';

import { normalizeSearchQuery, searchPhrases, uniqueById } from './helpers';

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
