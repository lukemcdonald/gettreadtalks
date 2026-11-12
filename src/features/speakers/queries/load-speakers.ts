'use cache';

import { fetchQuery } from 'convex/nextjs';
import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { loadFullPage } from '@/convex/lib/utils';
import { speakerRoles } from '@/convex/model/speakers/validators';

type SortOption = 'alphabetical' | 'featured';
const VALID_SORT_OPTIONS = new Set(['alphabetical', 'featured']);

interface GetSpeakersProps {
  cursor?: string;
  limit?: number;
  role?: string;
  search?: string;
  sort?: string;
}

/**
 * Get speakers with published content and optional filtering.
 */
// fallow-ignore-next-line complexity
export async function loadSpeakers(args?: GetSpeakersProps) {
  cacheLife('hours');
  cacheTag('speakers');

  const { cursor, limit, role, search, sort } = args ?? {};

  // Validate sort option from URL params (untrusted input)
  const sortOption = VALID_SORT_OPTIONS.has(sort as SortOption)
    ? (sort as SortOption)
    : 'alphabetical';
  const validRole = speakerRoles.find((speakerRole) => speakerRole === role);
  const result = await loadFullPage(
    (paginationOpts) =>
      fetchQuery(api.speakers.listSpeakers, {
        paginationOpts,
        role: validRole,
        search: search || undefined,
        sort: sortOption,
      }),
    (speakers) => speakers,
    {
      cursor: cursor ?? null,
      numItems: limit ?? Number.POSITIVE_INFINITY,
    }
  );

  return {
    continueCursor: result.continueCursor,
    isDone: result.isDone,
    speakers: result.page,
  };
}
