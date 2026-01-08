'use server';

import type { StatusType } from '@/convex/lib/validators/shared';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

type GetTalksWithSpeakersAdminProps = {
  cursor?: string;
  limit?: number;
  search?: string;
  status?: StatusType | 'all';
};

/**
 * Get talks with speakers for admin management.
 * Supports pagination and server-side filtering.
 * Supports status='all' to fetch talks across all statuses.
 *
 * @param cursor - Pagination cursor
 * @param limit - Number of items per page (defaults to 50)
 * @param search - Search by title
 * @param status - Filter by status or 'all' for all statuses
 */
export async function getTalksWithSpeakersAdmin(args?: GetTalksWithSpeakersAdminProps) {
  const { cursor, limit = 50, search, status = 'published' } = args ?? {};

  const token = await getAuthToken();

  const result = await fetchQuery(
    api.talks.listTalksWithSpeakersAdmin,
    {
      paginationOpts: { cursor: cursor || null, numItems: limit },
      search,
      status,
    },
    { token },
  );

  return {
    continueCursor: result.continueCursor,
    isDone: result.isDone,
    talks: result.page,
  };
}
