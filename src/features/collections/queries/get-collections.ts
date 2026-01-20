'use server';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

interface GetCollectionsProps {
  limit?: number;
}

/**
 * Get collections with stats.
 * Filters to only collections with published talks.
 */
export async function getCollections(args?: GetCollectionsProps) {
  const { limit } = args ?? {};

  const token = await getAuthToken();

  const paginationOpts = {
    cursor: null,
    numItems: limit ?? 1000,
  };

  const result = await fetchQuery(api.collections.listCollections, { paginationOpts }, { token });

  return {
    collections: result.page,
    continueCursor: result.continueCursor,
    isDone: result.isDone,
  };
}
