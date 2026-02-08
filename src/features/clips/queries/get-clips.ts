'use cache';

import { fetchQuery } from 'convex/nextjs';
import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';

interface GetClipsProps {
  cursor?: string;
  limit?: number;
}

/**
 * Get published clips with speakers.
 * Returns only published clips with published parent talks.
 * Defaults to 50 items per page, sorted by most recent.
 */
export async function getClips(args?: GetClipsProps) {
  cacheLife('hours');
  cacheTag('clips');

  const { cursor, limit = 50 } = args ?? {};

  const paginationOpts = {
    cursor: cursor || null,
    numItems: limit,
  };

  const result = await fetchQuery(api.clips.listClips, {
    paginationOpts,
    sort: 'recent',
  });

  return {
    clips: result.page,
    continueCursor: result.continueCursor,
    isDone: result.isDone,
  };
}
