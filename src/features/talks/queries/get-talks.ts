'use server';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

type SortOption = 'alphabetical' | 'oldest' | 'recent';

type GetTalksProps = {
  cursor?: string;
  featured?: boolean;
  limit?: number;
  search?: string;
  sort?: string;
  speakerSlug?: string;
  topicSlug?: string;
};

/**
 * Get published talks with speakers and optional filtering.
 *
 * @param cursor - Pagination cursor
 * @param featured - Filter to featured talks only
 * @param limit - Maximum number of talks to return (defaults to 50)
 * @param search - Search by title
 * @param sort - Sort order: 'recent' (default), 'oldest', 'alphabetical'
 * @param speakerSlug - Filter by speaker slug
 * @param topicSlug - Filter by topic slug
 */
export async function getTalks(args?: GetTalksProps) {
  const { cursor, featured, limit = 50, search, sort, speakerSlug, topicSlug } = args ?? {};

  const token = await getAuthToken();

  // Validate sort option
  const validSorts: SortOption[] = ['alphabetical', 'oldest', 'recent'];
  const sortOption: SortOption = validSorts.includes(sort as SortOption)
    ? (sort as SortOption)
    : 'recent';

  const result = await fetchQuery(
    api.talks.listTalks,
    {
      featured: featured || undefined,
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
    continueCursor: result.continueCursor,
    isDone: result.isDone,
    talks: result.page,
  };
}
