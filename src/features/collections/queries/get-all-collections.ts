'use server';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

type GetAllCollectionsProps = {
  limit?: number;
};

/**
 * Get all collections with stats (talk counts and speakers).
 */
export async function getAllCollections(args?: GetAllCollectionsProps) {
  const { limit } = args ?? {};

  const token = await getAuthToken();

  const paginationOpts = {
    cursor: null,
    numItems: limit ?? 1000,
  };

  const result = await fetchQuery(
    api.collections.listAllCollections,
    { paginationOpts },
    { token },
  );

  return {
    collections: result.page,
    continueCursor: result.continueCursor,
    isDone: result.isDone,
  };
}
