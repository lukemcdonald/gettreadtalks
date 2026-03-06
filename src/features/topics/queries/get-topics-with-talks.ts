'use cache';

import { fetchQuery } from 'convex/nextjs';
import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';

/**
 * Get topics with their talks for browsing (featured talks first).
 * Used for the topics browse page with horizontal scroll sections.
 */
export async function getTopicsWithTalks() {
  cacheLife('hours');
  cacheTag('topics');

  return await fetchQuery(api.topics.listTopicsWithTalks, {
    talksPerTopic: 4,
  });
}
