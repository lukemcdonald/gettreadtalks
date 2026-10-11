'use cache';

import { fetchQuery } from 'convex/nextjs';
import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { normalizeSearchQuery } from '@/convex/model/search/utils';
import { emptySiteSearch } from '@/features/search/utils';

interface SearchSiteArgs {
  limit?: number;
  query?: string;
}

export async function searchSite({ limit, query = '' }: SearchSiteArgs) {
  cacheLife('hours');
  cacheTag('clips', 'speakers', 'talks', 'topics');

  const normalizedQuery = normalizeSearchQuery(query);

  if (!normalizedQuery) {
    return emptySiteSearch;
  }

  return await fetchQuery(api.search.searchSite, {
    limit,
    query: normalizedQuery,
  });
}
