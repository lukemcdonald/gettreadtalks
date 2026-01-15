'use server';

import type { StatusFilterType } from '@/lib/entities/types';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

type GetAllTalksProps = {
  cursor?: string;
  limit?: number;
  search?: string;
  status?: StatusFilterType;
};

/**
 * Get all talks with speakers with filtering support.
 * Supports status='all' to fetch talks across all statuses.
 *
 * @param cursor - Pagination cursor
 * @param limit - Number of items per page (defaults to 50)
 * @param search - Search by title
 * @param status - Filter by status or 'all' for all statuses
 */
export async function getAllTalks(args: GetAllTalksProps = {}) {
  const token = await getAuthToken();

  const cursor = args.cursor ?? null;
  const limit = args.limit ?? 50;
  const search = args?.search;
  const status = args.status ?? 'published';

  const result = await fetchQuery(
    api.talks.listAllTalks,
    {
      paginationOpts: { cursor, numItems: limit },
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
