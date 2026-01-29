'use cache';

import { fetchQuery } from 'convex/nextjs';
import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';

interface GetCollectionsProps {
  limit?: number;
}

export async function getCollections(args?: GetCollectionsProps) {
  cacheLife('hours');
  cacheTag('collections');

  const { limit } = args ?? {};

  const paginationOpts = {
    cursor: null,
    numItems: limit ?? 1000,
  };

  const result = await fetchQuery(api.collections.listCollections, { paginationOpts });

  return {
    collections: result.page,
    continueCursor: result.continueCursor,
    isDone: result.isDone,
  };
}
