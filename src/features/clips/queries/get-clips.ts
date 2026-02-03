'use cache';

import { fetchQuery } from 'convex/nextjs';
import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';

type SortOption = 'alphabetical' | 'oldest' | 'recent';

interface GetClipsProps {
  cursor?: string;
  limit?: number;
  search?: string;
  sort?: string;
  speakerSlugs?: string[];
}

/**
 * Get published clips with speakers and optional filtering.
 * Returns only published clips with published parent talks.
 * Defaults to 50 items per page, sorted by most recent.
 */
export async function getClips(args?: GetClipsProps) {
  cacheLife('hours');
  cacheTag('clips');

  const { cursor, limit = 50, search, sort, speakerSlugs } = args ?? {};

  // Validate sort option
  const validSorts: SortOption[] = ['alphabetical', 'oldest', 'recent'];
  const sortOption: SortOption = validSorts.includes(sort as SortOption)
    ? (sort as SortOption)
    : 'recent';

  const paginationOpts = {
    cursor: cursor || null,
    numItems: limit,
  };

  const result = await fetchQuery(api.clips.listClips, {
    paginationOpts,
    search: search || undefined,
    sort: sortOption,
    speakerSlugs: speakerSlugs?.length ? speakerSlugs : undefined,
  });

  return {
    clips: result.page,
    continueCursor: result.continueCursor,
    isDone: result.isDone,
  };
}
