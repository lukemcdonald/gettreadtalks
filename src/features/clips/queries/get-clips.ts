'use server';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

type SortOption = 'alphabetical' | 'oldest' | 'recent';

interface GetClipsProps {
  cursor?: string;
  limit?: number;
  search?: string;
  sort?: string;
  speakerSlugs?: string[];
  topicSlugs?: string[];
}

/**
 * Get published clips with speakers and optional filtering.
 * Returns only published clips with published parent talks.
 * Defaults to 50 items per page, sorted by most recent.
 */
export async function getClips(args?: GetClipsProps) {
  const { cursor, limit = 50, search, sort, speakerSlugs, topicSlugs } = args ?? {};

  const token = await getAuthToken();

  // Validate sort option
  const validSorts: SortOption[] = ['alphabetical', 'oldest', 'recent'];
  const sortOption: SortOption = validSorts.includes(sort as SortOption)
    ? (sort as SortOption)
    : 'recent';

  const result = await fetchQuery(
    api.clips.listClips,
    {
      paginationOpts: {
        cursor: cursor || null,
        numItems: limit,
      },
      search: search || undefined,
      sort: sortOption,
      speakerSlugs: speakerSlugs?.length ? speakerSlugs : undefined,
      topicSlugs: topicSlugs?.length ? topicSlugs : undefined,
    },
    { token },
  );

  return {
    clips: result.page,
    continueCursor: result.continueCursor,
    isDone: result.isDone,
  };
}
