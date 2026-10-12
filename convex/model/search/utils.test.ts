import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { normalizeSearchQuery, searchPhrases, uniqueById } from './utils.ts';

describe('normalizeSearchQuery', () => {
  test('trims and collapses whitespace', () => {
    assert.equal(normalizeSearchQuery('  John   Piper  '), 'John Piper');
  });

  test('returns empty for blank input', () => {
    assert.equal(normalizeSearchQuery('   '), '');
  });
});

describe('searchPhrases', () => {
  test('returns nothing for a blank query', () => {
    assert.deepEqual(searchPhrases('   '), []);
  });

  test('keeps a single token as-is', () => {
    assert.deepEqual(searchPhrases('grace'), ['grace']);
  });

  test('searches the full name and each token', () => {
    assert.deepEqual(searchPhrases('John Piper'), [
      'John Piper',
      'John',
      'Piper',
    ]);
  });
});

describe('uniqueById', () => {
  test('keeps first-seen order and drops duplicates', () => {
    assert.deepEqual(
      uniqueById([
        { _id: 'a', title: 'first' },
        { _id: 'b', title: 'second' },
        { _id: 'a', title: 'duplicate' },
      ]),
      [
        { _id: 'a', title: 'first' },
        { _id: 'b', title: 'second' },
      ]
    );
  });
});
