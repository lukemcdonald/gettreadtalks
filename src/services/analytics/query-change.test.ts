import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { getLocationIntent, getQueryChange } from './query-change.ts';

describe('getQueryChange', () => {
  test('detects a committed search query', () => {
    assert.deepEqual(getQueryChange('', 'search=bible'), {
      filters: [],
      query: 'bible',
    });
  });

  test('detects a cleared search query', () => {
    assert.deepEqual(getQueryChange('search=bible', ''), {
      filters: [],
      query: '',
    });
  });

  test('detects filter changes and ignores pagination', () => {
    assert.deepEqual(
      getQueryChange(
        'role=Pastor&cursor=abc',
        'role=Teacher&cursor=def&prevCursor=abc'
      ),
      {
        filters: [{ filter: 'role', value: 'Teacher' }],
        query: undefined,
      }
    );
  });

  test('detects a removed filter as an empty value', () => {
    assert.deepEqual(getQueryChange('topics=grace', ''), {
      filters: [{ filter: 'topics', value: '' }],
      query: undefined,
    });
  });

  test('returns both search and filters when they change together', () => {
    assert.deepEqual(
      getQueryChange(
        'search=bible&sort=recent',
        'search=faith&sort=featured&speakers=jonny'
      ),
      {
        filters: [
          { filter: 'sort', value: 'featured' },
          { filter: 'speakers', value: 'jonny' },
        ],
        query: 'faith',
      }
    );
  });

  test('ignores token and unchanged params', () => {
    assert.deepEqual(
      getQueryChange('search=bible&token=secret', 'search=bible&token=other'),
      { filters: [], query: undefined }
    );
  });

  test('ignores a cursor-only pagination change', () => {
    assert.deepEqual(
      getQueryChange('search=bible&cursor=abc', 'search=bible&cursor=def'),
      { filters: [], query: undefined }
    );
  });
});

describe('getLocationIntent', () => {
  test('classifies first load and path changes as page', () => {
    assert.deepEqual(
      getLocationIntent(null, { path: '/talks', search: 'search=bible' }),
      { kind: 'page' }
    );
    assert.deepEqual(
      getLocationIntent(
        { path: '/talks', search: 'search=bible' },
        { path: '/speakers', search: 'search=bible' }
      ),
      { kind: 'page' }
    );
  });

  test('classifies search and filter changes as query intents', () => {
    assert.deepEqual(
      getLocationIntent(
        { path: '/talks', search: '' },
        { path: '/talks', search: 'search=bible' }
      ),
      { filters: [], kind: 'query', query: 'bible' }
    );
    assert.deepEqual(
      getLocationIntent(
        { path: '/speakers', search: '' },
        { path: '/speakers', search: 'role=Pastor' }
      ),
      {
        filters: [{ filter: 'role', value: 'Pastor' }],
        kind: 'query',
        query: undefined,
      }
    );
  });

  test('classifies pagination-only changes as a query no-op', () => {
    assert.deepEqual(
      getLocationIntent(
        { path: '/talks', search: 'search=bible&cursor=abc' },
        { path: '/talks', search: 'search=bible&cursor=def' }
      ),
      { filters: [], kind: 'query', query: undefined }
    );
  });
});
