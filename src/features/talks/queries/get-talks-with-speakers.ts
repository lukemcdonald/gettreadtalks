'use server';

import type { StatusType } from '@/lib/entities/types';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken, getCurrentUser } from '@/services/auth/server';
import { isAdmin } from '@/services/auth/utils';

type GetTalksWithSpeakersProps = {
  cursor?: string;
  limit?: number;
  status?: StatusType;
};

/**
 * Get talks with speakers with pagination support.
 *
 * For security: Non-admin users will only see published talks (enforced here).
 *
 * @param status - Filter by status (defaults to 'published')
 * @param cursor - Pagination cursor
 * @param limit - Maximum number of talks to return (defaults to 50)
 */
export async function getTalksWithSpeakers(args?: GetTalksWithSpeakersProps) {
  const { cursor, limit = 50, status } = args ?? {};

  const token = await getAuthToken();
  const user = await getCurrentUser();

  const effectiveStatus = isAdmin(user) ? status : 'published';

  const result = await fetchQuery(
    api.talks.listTalksWithSpeakers,
    {
      paginationOpts: {
        cursor: cursor || null,
        numItems: limit,
      },
      status: effectiveStatus,
    },
    { token },
  );

  return {
    continueCursor: result.continueCursor,
    isDone: result.isDone,
    talks: result.page,
  };
}
