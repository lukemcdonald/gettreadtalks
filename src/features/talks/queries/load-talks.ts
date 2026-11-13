'use cache';

import type { TalkFormat } from '@/convex/model/talks/validators';

import { fetchQuery } from 'convex/nextjs';
import { cacheLife, cacheTag } from 'next/cache';

import { PUBLIC_LISTING_PAGE_SIZE } from '@/constants/ui';
import { api } from '@/convex/_generated/api';

type SortOption = 'alphabetical' | 'featured' | 'oldest' | 'recent';

interface GetTalksProps {
  cursor?: string;
  featured?: boolean;
  format?: TalkFormat;
  limit?: number;
  search?: string;
  sort?: string;
  speakerSlugs?: string[];
  topicSlugs?: string[];
}

/**
 * Get published talks with speakers and optional filtering.
 * Defaults to one public listing page, sorted by most recent.
 */
// fallow-ignore-next-line complexity
export async function loadTalks(args?: GetTalksProps) {
  cacheLife('hours');
  cacheTag('talks');

  const {
    cursor,
    featured,
    format,
    limit = PUBLIC_LISTING_PAGE_SIZE,
    search,
    sort,
    speakerSlugs,
    topicSlugs,
  } = args ?? {};

  // Validate sort option
  const validSorts: SortOption[] = [
    'alphabetical',
    'featured',
    'oldest',
    'recent',
  ];
  const sortOption: SortOption = validSorts.includes(sort as SortOption)
    ? (sort as SortOption)
    : 'recent';

  const paginationOpts = {
    cursor: cursor ?? null,
    numItems: limit,
  };

  const result = await fetchQuery(api.talks.listTalks, {
    featured: featured || undefined,
    format,
    paginationOpts,
    search: search || undefined,
    sort: sortOption,
    speakerSlugs: speakerSlugs?.length ? speakerSlugs : undefined,
    topicSlugs: topicSlugs?.length ? topicSlugs : undefined,
  });

  return {
    continueCursor: result.continueCursor,
    isDone: result.isDone,
    talks: result.page,
  };
}
