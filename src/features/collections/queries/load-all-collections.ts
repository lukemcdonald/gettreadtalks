'use server';

import { api } from '@/convex/_generated/api';
import { fetchAuthQuery } from '@/services/auth/server';

interface LoadAllCollectionsProps {
  cursor?: string;
  limit?: number;
  search?: string;
  status?: 'all' | 'draft' | 'published';
}

export async function loadAllCollections(args: LoadAllCollectionsProps = {}) {
  const result = await fetchAuthQuery(api.collections.listAllCollections, {
    paginationOpts: {
      cursor: args.cursor ?? null,
      numItems: args.limit ?? 50,
    },
    search: args.search,
    status: args.status,
  });

  return {
    collections: result.page,
    continueCursor: result.continueCursor,
    isDone: result.isDone,
  };
}
