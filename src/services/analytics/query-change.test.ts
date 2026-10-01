import assert from 'node:assert/strict';
import { test } from 'node:test';

import { getQueryChange } from './query-change.ts';

test('detects a committed search query', () => {
  const result = getQueryChange('', 'search=bible');

  assert.deepEqual(result, { filters: [], query: 'bible' });
});

test('detects a cleared search query', () => {
  const result = getQueryChange('search=bible', '');

  assert.deepEqual(result, { filters: [], query: '' });
});

test('detects filter changes and ignores pagination', () => {
  const result = getQueryChange(
    'role=Pastor&cursor=abc',
    'role=Teacher&cursor=def&prevCursor=abc'
  );

  assert.deepEqual(result, {
    filters: [{ filter: 'role', value: 'Teacher' }],
    query: undefined,
  });
});

test('detects a removed filter as an empty value', () => {
  const result = getQueryChange('topics=grace', '');

  assert.deepEqual(result, {
    filters: [{ filter: 'topics', value: '' }],
    query: undefined,
  });
});

test('returns both search and filters when they change together', () => {
  const result = getQueryChange(
    'search=bible&sort=recent',
    'search=faith&sort=featured&speakers=jonny'
  );

  assert.deepEqual(result, {
    filters: [
      { filter: 'sort', value: 'featured' },
      { filter: 'speakers', value: 'jonny' },
    ],
    query: 'faith',
  });
});

test('ignores token and unchanged params', () => {
  const result = getQueryChange(
    'search=bible&token=secret',
    'search=bible&token=other'
  );

  assert.deepEqual(result, { filters: [], query: undefined });
});
