'use client';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import { normalizeSearchQuery } from '@/convex/model/search/utils';
import { emptySiteSearch } from '@/features/search/utils';

export function useSearchSite(query: string, limit?: number) {
  const normalizedQuery = normalizeSearchQuery(query);
  const results = useQuery(
    api.search.searchSite,
    normalizedQuery ? { limit, query: normalizedQuery } : 'skip'
  );

  return {
    isLoading: Boolean(normalizedQuery) && results === undefined,
    results: results ?? emptySiteSearch,
  };
}
