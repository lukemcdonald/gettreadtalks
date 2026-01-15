'use server';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

type GetTalksProps = {
  cursor?: string;
  limit?: number;
};

/**
 * Get published talks with speakers.
 *
 * @param cursor - Pagination cursor
 * @param limit - Maximum number of talks to return (defaults to 50)
 */
export async function getTalks(args?: GetTalksProps) {
  const { cursor, limit = 50 } = args ?? {};

  const token = await getAuthToken();

  const result = await fetchQuery(
    api.talks.listTalks,
    {
      paginationOpts: {
        cursor: cursor || null,
        numItems: limit,
      },
    },
    { token },
  );

  return {
    continueCursor: result.continueCursor,
    isDone: result.isDone,
    talks: result.page,
  };
}
