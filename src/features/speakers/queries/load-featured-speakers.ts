'use cache';

import { fetchQuery } from 'convex/nextjs';
import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { getRotationCacheLife, getTimeSeed } from '@/convex/lib/rotateContent';

/**
 * Get featured speakers for homepage.
 */
export async function loadFeaturedSpeakers(limit = 6) {
  cacheLife(getRotationCacheLife());
  cacheTag('speakers');

  const result = await fetchQuery(api.speakers.listFeaturedSpeakers, {
    limit,
    seed: getTimeSeed('daily'),
  });

  return {
    continueCursor: null,
    isDone: true,
    speakers: result ?? [],
  };
}
