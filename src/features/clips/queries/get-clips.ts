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
  speakerSlug?: string;
  topicSlug?: string;
}

/**
 * Get published clips with speakers and optional filtering.
 * Returns only published clips with published parent talks.
 * Defaults to 50 items per page, sorted by most recent.
 */
export async function getClips(args?: GetClipsProps) {
  const { cursor, limit = 50, search, sort, speakerSlug, topicSlug } = args ?? {};

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
      speakerSlug: speakerSlug || undefined,
      topicSlug: topicSlug || undefined,
    },
    { token },
  );

  return {
    clips: result.page,
    continueCursor: result.continueCursor,
    isDone: result.isDone,
  };
}
