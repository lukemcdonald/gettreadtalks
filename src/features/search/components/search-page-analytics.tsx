'use client';

import { useEffect } from 'react';

import { trackSettledSearch } from '@/features/search/analytics';

export function SearchPageAnalytics({
  query,
  resultCount,
}: {
  query: string;
  resultCount: number;
}) {
  useEffect(() => {
    trackSettledSearch({
      path: '/search',
      query,
      resultCount,
      source: 'page',
    });
  }, [query, resultCount]);

  return null;
}
