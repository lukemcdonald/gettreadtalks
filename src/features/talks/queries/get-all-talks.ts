'use server';

import type { StatusFilterType } from '@/lib/entities/types';

import { api } from '@/convex/_generated/api';
import { fetchAuthQuery } from '@/services/auth/server';

interface GetAllTalksProps {
  cursor?: string;
  limit?: number;
  search?: string;
  status?: StatusFilterType;
}

/**
 * Get all talks with speakers with filtering support.
 * Use status='all' to fetch across all statuses, defaults to 'published'.
 */
export async function getAllTalks(args: GetAllTalksProps = {}) {
  const paginationOpts = {
    cursor: args.cursor ?? null,
    numItems: args.limit ?? 50,
  };
  const search = args?.search;
  const status = args.status ?? 'published';

  const result = await fetchAuthQuery(api.talks.listAllTalks, {
    paginationOpts,
    search,
    status,
  });

  return {
    continueCursor: result.continueCursor,
    isDone: result.isDone,
    talks: result.page,
  };
}
