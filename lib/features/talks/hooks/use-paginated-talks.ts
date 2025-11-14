'use client';

import type { Preloaded } from 'convex/react';

import { useState } from 'react';
import { usePaginatedQuery, usePreloadedQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';

const PAGE_SIZE = 12;

type UsePaginatedTalksOptions = {
  pageSize?: number;
  preloadedTalks: Preloaded<typeof api.talks.listTalks>;
};

export function usePaginatedTalks({
  pageSize = PAGE_SIZE,
  preloadedTalks,
}: UsePaginatedTalksOptions) {
  const [hasLoadedMore, setHasLoadedMore] = useState(false);

  const { isDone, page: preloadedResults } = usePreloadedQuery(preloadedTalks);

  const { loadMore, results, status } = usePaginatedQuery(
    api.talks.listTalks,
    {},
    { initialNumItems: pageSize },
  );

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
