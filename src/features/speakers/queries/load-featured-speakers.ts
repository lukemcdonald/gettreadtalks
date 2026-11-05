'use cache';

import { fetchQuery } from 'convex/nextjs';
import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { getRotationCacheLife, getTimeSeed } from '@/convex/lib/rotateContent';

/**
 * Get featured speakers for homepage.
 */
export async function loadFeaturedSpeakers(limit = 6) {
  const now = Date.now();

  cacheLife(getRotationCacheLife('daily', now));
  cacheTag('speakers');

  const result = await fetchQuery(api.speakers.listFeaturedSpeakers, {
    limit,
    seed: getTimeSeed('daily', now),
  });

  return {
    continueCursor: null,
    isDone: true,
    speakers: result ?? [],
  };
}
