'use cache';

import { fetchQuery } from 'convex/nextjs';
import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { getRotationCacheLife, getTimeSeed } from '@/convex/lib/rotateContent';

/**
 * Get featured talks for homepage.
 */
export async function loadFeaturedTalks(limit = 6) {
  cacheLife(getRotationCacheLife());
  cacheTag('talks');

  const result = await fetchQuery(api.talks.listFeaturedTalksWithSpeakers, {
    limit,
    seed: getTimeSeed('daily'),
  });

  return {
    continueCursor: null,
    isDone: true,
    talks: result ?? [],
  };
}
