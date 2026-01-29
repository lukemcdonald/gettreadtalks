'use cache';

import { fetchQuery } from 'convex/nextjs';
import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { speakerRoles } from '@/convex/model/speakers/validators';

type SortOption = 'alphabetical' | 'featured';
const VALID_SORT_OPTIONS = ['alphabetical', 'featured'];

interface GetSpeakersProps {
  limit?: number;
  role?: string;
  search?: string;
  sort?: string;
}

/**
 * Get speakers with published content and optional filtering.
 */
export async function getSpeakers(args?: GetSpeakersProps) {
  cacheLife('hours');
  cacheTag('speakers');

  const { limit, role, search, sort } = args ?? {};

  // Validate sort option from URL params (untrusted input)
  const sortOption = VALID_SORT_OPTIONS.includes(sort as SortOption)
    ? (sort as SortOption)
    : 'alphabetical';

  const paginationOpts = {
    cursor: null,
    numItems: limit ?? 1000,
  };

  const validRole = speakerRoles.find((r) => r === role);

  const result = await fetchQuery(api.speakers.listSpeakers, {
    paginationOpts,
    role: validRole,
    search: search || undefined,
    sort: sortOption,
  });

  return {
    continueCursor: result.continueCursor,
    isDone: result.isDone,
    speakers: result.page,
  };
}
