'use server';

import type { StatusFilterType } from '@/lib/entities/types';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

interface GetAllClipsProps {
  limit?: number;
  status?: StatusFilterType;
}

/**
 * Get all clips with speakers with filtering support.
 * Supports status='all' to fetch clips across all statuses.
 */
export async function getAllClips(args?: GetAllClipsProps) {
  const { limit, status } = args ?? {};

  const token = await getAuthToken();

  const paginationOpts = {
    cursor: null,
    numItems: limit ?? 1000,
  };

  const result = await fetchQuery(
    api.clips.listAllClips,
    {
      paginationOpts,
      status,
    },
    { token },
  );

  return {
    clips: result.page,
    continueCursor: result.continueCursor,
    isDone: result.isDone,
  };
}
