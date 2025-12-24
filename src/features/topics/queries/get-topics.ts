'use server';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

/**
 * Get topics (for selector dropdown).
 */
export async function getTopics({ limit }: { limit?: number } = {}) {
  const token = await getAuthToken();
  const topics = await fetchQuery(api.topics.listTopics, { limit: limit ?? 1000 }, { token });

  return {
    continueCursor: null,
    isDone: true,
    topics: topics ?? [],
  };
}
