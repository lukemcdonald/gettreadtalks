'use server';

import type { StatusFilterType } from '@/lib/entities/types';

import { api } from '@/convex/_generated/api';
import { fetchAuthQuery } from '@/services/auth/server';

interface GetAllClipsProps {
  cursor?: string;
  limit?: number;
  status?: StatusFilterType;
}

/**
 * Get all clips with speakers with filtering support.
 * Supports status='all' to fetch clips across all statuses.
 */
export async function getAllClips(args?: GetAllClipsProps) {
  const { cursor, limit, status } = args ?? {};

  const paginationOpts = {
    cursor: cursor ?? null,
    numItems: limit ?? 1000,
  };

  const result = await fetchAuthQuery(api.clips.listAllClips, {
    paginationOpts,
    status,
  });

  return {
    clips: result.page,
    continueCursor: result.continueCursor,
    isDone: result.isDone,
  };
}
