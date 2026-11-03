'use server';

import type { StatusFilterType } from '@/lib/entities/types';

import { api } from '@/convex/_generated/api';
import { fetchAuthQuery } from '@/services/auth/server';

interface GetAllClipsProps {
  cursor?: string;
  limit?: number;
  search?: string;
  status?: StatusFilterType;
}

/**
 * Get all clips with speakers with filtering support.
 * Defaults to published. Pass status='all' to fetch every status.
 */
export async function loadAllClips(args?: GetAllClipsProps) {
  const { cursor, limit, search, status } = args ?? {};

  const paginationOpts = {
    cursor: cursor ?? null,
    numItems: limit ?? 1000,
  };

  const result = await fetchAuthQuery(api.clips.listAllClips, {
    paginationOpts,
    search,
    status,
  });

  return {
    clips: result.page,
    continueCursor: result.continueCursor,
    isDone: result.isDone,
  };
}
