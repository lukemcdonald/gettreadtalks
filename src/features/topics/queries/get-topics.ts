'use cache';

import { fetchQuery } from 'convex/nextjs';
import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';

interface GetTopicsProps {
  limit?: number;
}

/**
 * Get topics for selector dropdowns.
 */
export async function getTopics(args?: GetTopicsProps) {
  cacheLife('hours');
  cacheTag('topics');

  const { limit } = args ?? {};

  const topics = await fetchQuery(api.topics.listTopics, { limit: limit ?? 1000 });

  return {
    continueCursor: null,
    isDone: true,
    topics: topics ?? [],
  };
}
