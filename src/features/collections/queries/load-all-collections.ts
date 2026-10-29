'use server';

import { api } from '@/convex/_generated/api';
import { fetchAuthQuery } from '@/services/auth/server';

interface GetAllCollectionsProps {
  cursor?: string;
  limit?: number;
  search?: string;
}

export async function loadAllCollections(args: GetAllCollectionsProps = {}) {
  const result = await fetchAuthQuery(api.collections.listAllCollections, {
    paginationOpts: {
      cursor: args.cursor ?? null,
      numItems: args.limit ?? 50,
    },
    search: args.search,
  });

  return {
    collections: result.page,
    continueCursor: result.continueCursor,
    isDone: result.isDone,
  };
}
