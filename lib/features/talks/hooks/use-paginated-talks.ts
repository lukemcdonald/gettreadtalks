'use client';

import type { Preloaded } from 'convex/react';

import { useState } from 'react';

import { usePaginatedQuery, usePreloadedQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';

const PAGE_SIZE = 12;

interface UsePaginatedTalksOptions {
  pageSize?: number;
  preloadedTalks: Preloaded<typeof api.talks.listTalks>;
}

/**
 * Hook for paginated talks with preloaded data.
 * Uses preloaded data initially, then switches to paginated query for "Load More".
 */
export function usePaginatedTalks({
  pageSize = PAGE_SIZE,
  preloadedTalks,
}: UsePaginatedTalksOptions) {
  const [hasLoadedMore, setHasLoadedMore] = useState(false);

  // Use preloaded data initially
  const { isDone, page: preloadedResults } = usePreloadedQuery(preloadedTalks);

  // Paginated query for "Load More" functionality
  const { loadMore, results, status } = usePaginatedQuery(
    api.talks.listTalks,
    {},
    { initialNumItems: pageSize },
  );

  // Switch to paginated results after first load more
  const talks = hasLoadedMore ? results : preloadedResults;
  const canLoadMore = hasLoadedMore ? status === 'CanLoadMore' : !isDone;

  const handleLoadMore = () => {
    setHasLoadedMore(true);
    loadMore(pageSize);
  };

  return {
    canLoadMore,
    data: talks ?? [],
    loadMore: handleLoadMore,
  };
}
