'use server';

import { api } from '@/convex/_generated/api';
import { fetchAuthQuery } from '@/services/auth/server';

interface LoadSpeakersAdminProps {
  cursor?: string;
  limit?: number;
  search?: string;
}

export async function loadSpeakersAdmin(args: LoadSpeakersAdminProps = {}) {
  const result = await fetchAuthQuery(api.speakers.listAllSpeakersAdmin, {
    paginationOpts: {
      cursor: args.cursor ?? null,
      numItems: args.limit ?? 50,
    },
    search: args.search,
  });

  return {
    continueCursor: result.continueCursor,
    isDone: result.isDone,
    speakers: result.page,
  };
}
