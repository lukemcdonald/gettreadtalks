'use server';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

type SortOption = 'alphabetical' | 'featured';

type GetSpeakersProps = {
  limit?: number;
  role?: string;
  search?: string;
  sort?: string;
};

/**
 * Get speakers with published content and optional filtering.
 */
export async function getSpeakers(args?: GetSpeakersProps) {
  const { limit, role, search, sort } = args ?? {};

  const token = await getAuthToken();

  // Validate sort option
  const validSorts: SortOption[] = ['alphabetical', 'featured'];
  const sortOption: SortOption = validSorts.includes(sort as SortOption)
    ? (sort as SortOption)
    : 'alphabetical';

  const paginationOpts = {
    cursor: null,
    numItems: limit ?? 1000,
  };

  const result = await fetchQuery(
    api.speakers.listSpeakers,
    {
      paginationOpts,
      role: role || undefined,
      search: search || undefined,
      sort: sortOption,
    },
    { token },
  );

  return {
    continueCursor: result.continueCursor,
    isDone: result.isDone,
    speakers: result.page,
  };
}
