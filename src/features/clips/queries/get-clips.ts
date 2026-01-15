'use server';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

type GetClipsProps = {
  limit?: number;
};

/**
 * Get published clips with speakers.
 * Returns only published clips with published parent talks.
 */
export async function getClips(args?: GetClipsProps) {
  const { limit } = args ?? {};

  const token = await getAuthToken();

  const result = await fetchQuery(
    api.clips.listClips,
    {
      paginationOpts: { cursor: null, numItems: limit ?? 1000 },
    },
    { token },
  );

  return {
    clips: result.page,
    continueCursor: result.continueCursor,
    isDone: result.isDone,
  };
}
