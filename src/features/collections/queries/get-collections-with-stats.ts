'use server';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

type GetCollectionsWithStatsProps = {
  limit?: number;
};

/**
 * Get collections with stats (talk counts and speakers) for list page.
 */
export async function getCollectionsWithStats(args?: GetCollectionsWithStatsProps) {
  const { limit } = args ?? {};

  const token = await getAuthToken();

  const paginationOpts = {
    cursor: null,
    numItems: limit ?? 1000,
  };

  const result = await fetchQuery(
    api.collections.listCollectionsWithStats,
    { paginationOpts },
    { token },
  );

  return {
    collections: result.page,
    continueCursor: result.continueCursor,
    isDone: result.isDone,
  };
}
