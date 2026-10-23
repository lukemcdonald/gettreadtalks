'use server';

import type { StatusFilterType } from '@/lib/entities/types';

import { api } from '@/convex/_generated/api';
import { fetchAuthQuery } from '@/services/auth/server';

interface GetAllTalksProps {
  cursor?: string;
  limit?: number;
  search?: string;
  status?: StatusFilterType;
  studyStatus?: 'draft' | 'none' | 'published';
}

/**
 * Get all talks with speakers with filtering support.
 * Use status='all' to fetch across all statuses, defaults to 'published'.
 */
// fallow-ignore-next-line complexity
export async function loadAllTalks(args: GetAllTalksProps = {}) {
  const paginationOpts = {
    cursor: args.cursor ?? null,
    numItems: args.limit ?? 50,
  };
  const { search, status = 'published', studyStatus } = args;

  const result = await fetchAuthQuery(api.talks.listAllTalks, {
    paginationOpts,
    search,
    status,
    studyStatus,
  });

  return {
    continueCursor: result.continueCursor,
    isDone: result.isDone,
    talks: result.page,
  };
}
