'use server';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

export async function getTopicsWithCounts() {
  const token = await getAuthToken();
  return await fetchQuery(api.topics.listTopicsWithCount, {}, { token });
}

/**
 * Get topics (for selector dropdown).
 */
export async function getTopics({ limit }: { limit?: number } = {}) {
  const token = await getAuthToken();
  const topics = await fetchQuery(api.topics.listTopics, { limit: limit ?? 1000 }, { token });

  return {
    topics: topics ?? [],
    continueCursor: null,
    isDone: true,
  };
}

export async function getTopicBySlug(slug: string) {
  const token = await getAuthToken();

  return await fetchQuery(api.topics.getTopicBySlug, { limit: 100, slug }, { token });
}
