'use cache';

import { fetchQuery } from 'convex/nextjs';
import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import {
  getTimeSeed,
  secondsUntilNextRotation,
} from '@/convex/lib/rotateContent';

/**
 * Get featured talks for homepage.
 */
export async function loadFeaturedTalks(limit = 6) {
  const expire = secondsUntilNextRotation('daily');

  cacheLife({
    expire,
    revalidate: expire,
    stale: expire,
  });
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
