'use server';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

/**
 * Get featured speakers for homepage.
 */
export async function getFeaturedSpeakers(limit = 6) {
  const token = await getAuthToken();

  const result = await fetchQuery(api.speakers.listFeaturedSpeakers, { limit }, { token });

  return {
    continueCursor: null,
    isDone: true,
    speakers: result ?? [],
  };
}
