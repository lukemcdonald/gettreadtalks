'use server';

import { api } from '@/convex/_generated/api';
import { fetchAuthQuery } from '@/services/auth/server';

interface LoadAllTopicsProps {
  cursor?: string;
  limit?: number;
  search?: string;
}

export async function loadAllTopics(args: LoadAllTopicsProps = {}) {
  const result = await fetchAuthQuery(api.topics.listAllTopics, {
    paginationOpts: {
      cursor: args.cursor ?? null,
      numItems: args.limit ?? 50,
    },
    search: args.search,
  });

  return {
    continueCursor: result.continueCursor,
    isDone: result.isDone,
    topics: result.page,
  };
}
