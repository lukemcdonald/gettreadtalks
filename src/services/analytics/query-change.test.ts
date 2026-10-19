import { describe, expect, it } from '@/test';

import { getLocationIntent, getQueryChange } from './query-change';

describe('getQueryChange', () => {
  it('detects a committed search query', () => {
    expect(getQueryChange('', 'search=bible')).toEqual({
      filters: [],
      query: 'bible',
    });
  });

  it('detects a cleared search query', () => {
    expect(getQueryChange('search=bible', '')).toEqual({
      filters: [],
      query: '',
    });
  });

  it('detects filter changes and ignores pagination', () => {
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

  it('detects a removed filter as an empty value', () => {
    expect(getQueryChange('topics=grace', '')).toEqual({
      filters: [{ filter: 'topics', value: '' }],
      query: undefined,
    });
  });

  it('returns both search and filters when they change together', () => {
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

  it('ignores token and unchanged params', () => {
    expect(
      getQueryChange('search=bible&token=secret', 'search=bible&token=other')
    ).toEqual({ filters: [], query: undefined });
  });
});

describe('getLocationIntent', () => {
  it('classifies first load and path changes as page', () => {
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

  it('classifies search and filter changes as query intents', () => {
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

  it('classifies pagination-only changes as a query no-op', () => {
    expect(
      getLocationIntent(
        { path: '/talks', search: 'search=bible&cursor=abc' },
        { path: '/talks', search: 'search=bible&cursor=def' }
      )
    ).toEqual({ filters: [], kind: 'query', query: undefined });
  });
});
