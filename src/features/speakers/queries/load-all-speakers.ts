'use server';

import { api } from '@/convex/_generated/api';
import { fetchAuthQuery } from '@/services/auth/server';

interface LoadAllSpeakersProps {
  cursor?: string;
  limit?: number;
  search?: string;
  status?: 'all' | 'draft' | 'published';
}

export async function loadAllSpeakers(args: LoadAllSpeakersProps = {}) {
  const result = await fetchAuthQuery(api.speakers.listAllSpeakers, {
    paginationOpts: {
      cursor: args.cursor ?? null,
      numItems: args.limit ?? 50,
    },
    search: args.search,
    status: args.status,
  });

  return {
    continueCursor: result.continueCursor,
    isDone: result.isDone,
    speakers: result.page,
  };
}
