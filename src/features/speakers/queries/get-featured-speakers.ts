'use cache';

import { fetchQuery } from 'convex/nextjs';
import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';

/**
 * Get featured speakers for homepage.
 */
export async function getFeaturedSpeakers(limit = 6) {
  cacheLife('hours');
  cacheTag('speakers');

  const result = await fetchQuery(api.speakers.listFeaturedSpeakers, { limit });

  return {
    continueCursor: null,
    isDone: true,
    speakers: result ?? [],
  };
}
