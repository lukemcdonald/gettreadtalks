'use server';

import { api } from '@/convex/_generated/api';
import { fetchAuthQuery } from '@/services/auth/server';

interface GetAllCollectionsProps {
  limit?: number;
}

export async function getAllCollections(args?: GetAllCollectionsProps) {
  const { limit } = args ?? {};

  const paginationOpts = {
    cursor: null,
    numItems: limit ?? 1000,
  };

  const result = await fetchAuthQuery(api.collections.listAllCollections, {
    paginationOpts,
  });

  return {
    collections: result.page,
    continueCursor: result.continueCursor,
    isDone: result.isDone,
  };
}
