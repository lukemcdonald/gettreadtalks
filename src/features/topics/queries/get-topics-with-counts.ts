'use server';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

type SortOption = 'alphabetical' | 'least-talks' | 'most-talks';

interface GetTopicsWithCountsProps {
  search?: string;
  sort?: string;
}

/**
 * Get topics with their associated talk counts.
 * Supports optional search and sort filtering.
 */
export async function getTopicsWithCounts(args?: GetTopicsWithCountsProps) {
  const { search, sort } = args ?? {};

  const token = await getAuthToken();

  // Validate sort option
  const validSorts: SortOption[] = ['alphabetical', 'least-talks', 'most-talks'];
  const sortOption: SortOption = validSorts.includes(sort as SortOption)
    ? (sort as SortOption)
    : 'alphabetical';

  return await fetchQuery(
    api.topics.listTopicsWithCount,
    {
      search: search || undefined,
      sort: sortOption,
    },
    { token },
  );
}
