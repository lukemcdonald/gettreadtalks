import { describe, expect, test } from 'vitest';

import { getLocationIntent, getQueryChange } from './query-change';

describe('getQueryChange', () => {
  test('detects a committed search query', () => {
    expect(getQueryChange('', 'search=bible')).toEqual({
      filters: [],
      query: 'bible',
    });
  });

  test('detects a cleared search query', () => {
    expect(getQueryChange('search=bible', '')).toEqual({
      filters: [],
      query: '',
    });
  });

  test('detects filter changes and ignores pagination', () => {
    expect(
      getQueryChange(
        'role=Pastor&cursor=abc',
        'role=Teacher&cursor=def&prevCursor=abc'
      )
    ).toEqual({
      filters: [{ filter: 'role', value: 'Teacher' }],
      query: undefined,
    });
  });

  test('detects a removed filter as an empty value', () => {
    expect(getQueryChange('topics=grace', '')).toEqual({
      filters: [{ filter: 'topics', value: '' }],
      query: undefined,
    });
  });

  test('returns both search and filters when they change together', () => {
    expect(
      getQueryChange(
        'search=bible&sort=recent',
        'search=faith&sort=featured&speakers=jonny'
      )
    ).toEqual({
      filters: [
        { filter: 'sort', value: 'featured' },
        { filter: 'speakers', value: 'jonny' },
      ],
      query: 'faith',
    });
  });

  test('ignores token and unchanged params', () => {
    expect(
      getQueryChange('search=bible&token=secret', 'search=bible&token=other')
    ).toEqual({ filters: [], query: undefined });
  });

  test('ignores a cursor-only pagination change', () => {
    expect(
      getQueryChange('search=bible&cursor=abc', 'search=bible&cursor=def')
    ).toEqual({ filters: [], query: undefined });
  });
});

describe('getLocationIntent', () => {
  test('classifies first load and path changes as page', () => {
    expect(
      getLocationIntent(null, { path: '/talks', search: 'search=bible' })
    ).toEqual({ kind: 'page' });
    expect(
      getLocationIntent(
        { path: '/talks', search: 'search=bible' },
        { path: '/speakers', search: 'search=bible' }
      )
    ).toEqual({ kind: 'page' });
  });

  test('classifies search and filter changes as query intents', () => {
    expect(
      getLocationIntent(
        { path: '/talks', search: '' },
        { path: '/talks', search: 'search=bible' }
      )
    ).toEqual({ filters: [], kind: 'query', query: 'bible' });
    expect(
      getLocationIntent(
        { path: '/speakers', search: '' },
        { path: '/speakers', search: 'role=Pastor' }
      )
    ).toEqual({
      filters: [{ filter: 'role', value: 'Pastor' }],
      kind: 'query',
      query: undefined,
    });
  });

  test('classifies pagination-only changes as a query no-op', () => {
    expect(
      getLocationIntent(
        { path: '/talks', search: 'search=bible&cursor=abc' },
        { path: '/talks', search: 'search=bible&cursor=def' }
      )
    ).toEqual({ filters: [], kind: 'query', query: undefined });
  });
});
