'use server';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

type GetTopicsProps = {
  limit?: number;
};

/**
 * Get topics for selector dropdowns.
 */
export async function getTopics(args?: GetTopicsProps) {
  const { limit } = args ?? {};

  const token = await getAuthToken();
  const topics = await fetchQuery(api.topics.listTopics, { limit: limit ?? 1000 }, { token });

  return {
    continueCursor: null,
    isDone: true,
    topics: topics ?? [],
  };
}
