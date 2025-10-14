'use client';

import { usePaginatedQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';

type Options = {
  pageSize?: number;
};

export function useTalks(options: Options = {}) {
  const { pageSize = 12 } = options;

  const { loadMore, results, status } = usePaginatedQuery(
    api.talks.list,
    {},
    { initialNumItems: pageSize },
  );

  const canLoadMore = status === 'CanLoadMore';
  const isLoading = status === 'LoadingFirstPage';
  const isLoadingMore = status === 'LoadingMore';
  const isExhausted = status === 'Exhausted';

  return {
    canLoadMore,
    data: results ?? [],
    isExhausted,
    isLoading,
    isLoadingMore,
    loadMore,
    pageSize,
    status,
  };
}
