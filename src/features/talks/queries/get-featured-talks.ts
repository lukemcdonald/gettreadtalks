'use cache';

import { fetchQuery } from 'convex/nextjs';
import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';

/**
 * Get featured talks for homepage.
 */
export async function getFeaturedTalks(limit = 6) {
  cacheLife('hours');
  cacheTag('talks');

  const result = await fetchQuery(api.talks.listFeaturedTalksWithSpeakers, { limit });

  return {
    continueCursor: null,
    isDone: true,
    talks: result ?? [],
  };
}
