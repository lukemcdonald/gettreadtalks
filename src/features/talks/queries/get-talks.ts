'use server';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

type SortOption = 'alphabetical' | 'featured' | 'oldest' | 'recent';

interface GetTalksProps {
  cursor?: string;
  featured?: boolean;
  limit?: number;
  search?: string;
  sort?: string;
  speakerSlugs?: string[];
  topicSlugs?: string[];
}

/**
 * Get published talks with speakers and optional filtering.
 * Defaults to 50 items per page, sorted by most recent.
 */
export async function getTalks(args?: GetTalksProps) {
  const { cursor, featured, limit = 50, search, sort, speakerSlugs, topicSlugs } = args ?? {};

  const token = await getAuthToken();

  // Validate sort option
  const validSorts: SortOption[] = ['alphabetical', 'featured', 'oldest', 'recent'];
  const sortOption: SortOption = validSorts.includes(sort as SortOption)
    ? (sort as SortOption)
    : 'recent';

  const paginationOpts = {
    cursor: cursor || null,
    numItems: limit,
  };

  const result = await fetchQuery(
    api.talks.listTalks,
    {
      featured: featured || undefined,
      paginationOpts,
      search: search || undefined,
      sort: sortOption,
      speakerSlugs: speakerSlugs?.length ? speakerSlugs : undefined,
      topicSlugs: topicSlugs?.length ? topicSlugs : undefined,
    },
    { token },
  );

  return {
    continueCursor: result.continueCursor,
    isDone: result.isDone,
    talks: result.page,
  };
}
