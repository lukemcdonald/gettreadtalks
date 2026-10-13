'use client';

import type { CommandSearchItem, SearchHit } from '@/features/search/types';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { getSearchSelectionAnalytics } from '@/features/search/utils';
import { track } from '@/services/analytics';

export function trackSettledSearch({
  path,
  query,
  resultCount,
  source,
}: {
  path: string;
  query: string;
  resultCount: number;
  source: 'header' | 'page';
}) {
  track('search_performed', {
    path,
    query,
    result_count: resultCount,
    source,
  });

  if (resultCount > 0) {
    return;
  }

  track('search_no_results', {
    path,
    query,
    source,
  });
}

export function useHeaderSearchAnalytics({
  debouncedQuery,
  hitsLength,
  isPending,
  open,
}: {
  debouncedQuery: string;
  hitsLength: number;
  isPending: boolean;
  open: boolean;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (!open || isPending || !debouncedQuery) {
      return;
    }

    trackSettledSearch({
      path: pathname,
      query: debouncedQuery,
      resultCount: hitsLength,
      source: 'header',
    });
  }, [debouncedQuery, hitsLength, isPending, open, pathname]);

  function trackSelection({
    hits,
    item,
    query,
  }: {
    hits: SearchHit[];
    item: CommandSearchItem;
    query: string;
  }) {
    const selection = getSearchSelectionAnalytics({
      hits,
      itemValue: item.value,
      query,
    });

    if (!selection) {
      return;
    }

    track('search_result_selected', {
      path: pathname,
      position: selection.position,
      query: selection.query,
      result_type: selection.result_type,
      source: 'header',
    });
  }

  return { trackSelection };
}
