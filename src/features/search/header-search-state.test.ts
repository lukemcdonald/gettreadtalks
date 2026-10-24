import type { SearchHit } from '@/features/search/types';

import { describe, expect, it } from '@/test';

import {
  getPreviousHitsAfterValueChange,
  headerSearchReducer,
  INITIAL_HEADER_SEARCH_STATE,
} from './header-search-state';

const hits: SearchHit[] = [
  {
    href: '/talks/john-doe/grace',
    id: 'talk1',
    title: 'Grace',
    type: 'talk',
  },
];

const previousHits: SearchHit[] = [
  {
    href: '/talks/john-doe/the-cross',
    id: 'talk0',
    title: 'The Cross',
    type: 'talk',
  },
];

describe('getPreviousHitsAfterValueChange', () => {
  it('clears previous hits when the next value is blank', () => {
    expect(
      getPreviousHitsAfterValueChange({
        hasQuery: true,
        hits,
        isPending: false,
        nextValue: '   ',
        previousHits,
      })
    ).toBeNull();
  });

  it('snapshots current hits once a settled query changes', () => {
    expect(
      getPreviousHitsAfterValueChange({
        hasQuery: true,
        hits,
        isPending: false,
        nextValue: 'grace',
        previousHits,
      })
    ).toEqual(hits);
  });

  it('keeps previous hits while the first query is pending', () => {
    expect(
      getPreviousHitsAfterValueChange({
        hasQuery: false,
        hits,
        isPending: true,
        nextValue: 'g',
        previousHits,
      })
    ).toEqual(previousHits);
  });
});

describe('headerSearchReducer', () => {
  it('opens, toggles, and closes without clearing the query', () => {
    const opened = headerSearchReducer(INITIAL_HEADER_SEARCH_STATE, {
      type: 'open',
    });
    const typed = headerSearchReducer(opened, {
      hasQuery: false,
      hits: [],
      isPending: true,
      nextValue: 'grace',
      type: 'changeValue',
    });
    const closed = headerSearchReducer(typed, { type: 'close' });

    expect(opened.open).toBe(true);
    expect(headerSearchReducer(opened, { type: 'toggle' }).open).toBe(false);
    expect(closed).toEqual({
      open: false,
      previousHits: null,
      value: 'grace',
    });
  });

  it('clears the query and previous hits after a navigation close', () => {
    const state = headerSearchReducer(
      {
        open: true,
        previousHits,
        value: 'grace',
      },
      { didNavigate: true, type: 'close' }
    );

    expect(state).toEqual({
      open: false,
      previousHits: null,
      value: '',
    });
  });
});
