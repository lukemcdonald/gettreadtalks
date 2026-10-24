'use client';

import type { SearchHit } from '@/features/search/types';

import { useDebouncedSearchQuery } from '@/features/search/hooks/use-debounced-search-query';
import { useSearchSite } from '@/features/search/hooks/use-search-site';
import {
  getHeaderSearchState,
  SEARCH_DROPDOWN_LIMIT,
  toSearchHits,
} from '@/features/search/utils';
import { useCurrentUser } from '@/features/users/hooks/use-current-user';

export function useHeaderSearchResults(
  previousHits: SearchHit[] | null,
  value: string
) {
  const { data: user } = useCurrentUser();
  const { debouncedQuery, resetDebouncedQuery } =
    useDebouncedSearchQuery(value);
  const { isLoading, results } = useSearchSite(
    debouncedQuery,
    SEARCH_DROPDOWN_LIMIT
  );
  const hits = toSearchHits(results);
  const hasQuery = value.trim().length > 0;
  const isPending = isLoading || value.trim() !== debouncedQuery;
  const { groups, status } = getHeaderSearchState({
    hits,
    isPending,
    isSignedIn: Boolean(user),
    previousHits,
    value,
  });

  return {
    debouncedQuery,
    groups,
    hasQuery,
    hits,
    isPending,
    resetDebouncedQuery,
    status,
  };
}
