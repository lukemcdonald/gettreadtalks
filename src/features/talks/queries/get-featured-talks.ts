'use server';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

/**
 * Get featured talks for homepage.
 */
export async function getFeaturedTalks(limit = 6) {
  const token = await getAuthToken();

  const result = await fetchQuery(api.talks.listFeaturedTalksWithSpeakers, { limit }, { token });

  return {
    continueCursor: null,
    isDone: true,
    talks: result ?? [],
  };
}
