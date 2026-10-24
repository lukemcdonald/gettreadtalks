import type { SearchHit } from '@/features/search/types';

import { getHeaderSearchQueryAfterClose } from '@/features/search/utils';

export type HeaderSearchAction =
  | { didNavigate?: boolean; type: 'close' }
  | { type: 'open' }
  | { type: 'toggle' }
  | {
      hasQuery: boolean;
      hits: SearchHit[];
      isPending: boolean;
      nextValue: string;
      type: 'changeValue';
    };

export interface HeaderSearchState {
  open: boolean;
  previousHits: SearchHit[] | null;
  value: string;
}

export const INITIAL_HEADER_SEARCH_STATE: HeaderSearchState = {
  open: false,
  previousHits: null,
  value: '',
};

export function getPreviousHitsAfterValueChange({
  hasQuery,
  hits,
  isPending,
  nextValue,
  previousHits,
}: {
  hasQuery: boolean;
  hits: SearchHit[];
  isPending: boolean;
  nextValue: string;
  previousHits: SearchHit[] | null;
}): SearchHit[] | null {
  if (!nextValue.trim()) {
    return null;
  }

  if (hasQuery && !isPending) {
    return hits;
  }

  return previousHits;
}

export function headerSearchReducer(
  state: HeaderSearchState,
  action: HeaderSearchAction
): HeaderSearchState {
  switch (action.type) {
    case 'changeValue': {
      return {
        ...state,
        previousHits: getPreviousHitsAfterValueChange({
          hasQuery: action.hasQuery,
          hits: action.hits,
          isPending: action.isPending,
          nextValue: action.nextValue,
          previousHits: state.previousHits,
        }),
        value: action.nextValue,
      };
    }
    case 'close': {
      return {
        open: false,
        previousHits: action.didNavigate ? null : state.previousHits,
        value: getHeaderSearchQueryAfterClose(
          state.value,
          Boolean(action.didNavigate)
        ),
      };
    }
    case 'open': {
      return { ...state, open: true };
    }
    case 'toggle': {
      return { ...state, open: !state.open };
    }
    default: {
      return state;
    }
  }
}
