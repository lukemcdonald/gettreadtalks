'use client';

import type { CommandSearchItem } from '@/features/search/types';

import { useRouter } from 'next/navigation';
import { useReducer } from 'react';

import { useHeaderSearchAnalytics } from '@/features/search/analytics';
import {
  headerSearchReducer,
  INITIAL_HEADER_SEARCH_STATE,
} from '@/features/search/header-search-state';
import { useHeaderSearchHotkeys } from '@/features/search/hooks/use-header-search-hotkeys';
import { useHeaderSearchResults } from '@/features/search/hooks/use-header-search-results';

export function useHeaderSearch() {
  const router = useRouter();
  const [state, dispatch] = useReducer(
    headerSearchReducer,
    INITIAL_HEADER_SEARCH_STATE
  );
  const { open, previousHits, value } = state;
  const search = useHeaderSearchResults(previousHits, value);
  const { trackSelection } = useHeaderSearchAnalytics({
    debouncedQuery: search.debouncedQuery,
    hitsLength: search.hits.length,
    isPending: search.isPending,
    open,
  });

  useHeaderSearchHotkeys(dispatch);

  function handleOpenChange(nextOpen: boolean) {
    dispatch(nextOpen ? { type: 'open' } : { type: 'close' });
  }

  function handleValueChange(nextValue: string) {
    dispatch({
      hasQuery: search.hasQuery,
      hits: search.hits,
      isPending: search.isPending,
      nextValue,
      type: 'changeValue',
    });
  }

  function handleSelect(item: CommandSearchItem) {
    trackSelection({
      hits:
        search.isPending && previousHits !== null ? previousHits : search.hits,
      item,
      query: value,
    });
    router.push(item.href);
    search.resetDebouncedQuery();
    dispatch({ didNavigate: true, type: 'close' });
  }

  return {
    groups: search.groups,
    handleOpenChange,
    handleSelect,
    handleValueChange,
    isLoading: search.hasQuery && search.isPending,
    open,
    status: search.status,
    value,
  };
}
