'use server';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

/**
 * Get collections with stats (talk counts and speakers) for list page.
 */
export async function getCollectionsWithStats({ limit }: { limit?: number } = {}) {
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

/**
 * Get collection by slug with talks in order.
 */
export async function getCollectionBySlug(slug: string) {
  const token = await getAuthToken();

  return await fetchQuery(api.collections.getCollectionBySlug, { slug }, { token });
}
