'use server';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

/**
 * Get topic by slug with associated talks.
 */
export async function getTopicBySlug(slug: string) {
  const token = await getAuthToken();

  return await fetchQuery(api.topics.getTopicBySlug, { limit: 100, slug }, { token });
}
