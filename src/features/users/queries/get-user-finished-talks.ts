'use server';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

/**
 * Get user finished talks server-side. Returns empty result if not authenticated.
 */
export async function getUserFinishedTalks(limit?: number) {
  const authToken = await getAuthToken();

  if (!authToken) {
    return {
      continueCursor: null,
      isDone: true,
      talks: [],
    };
  }

  const result = await fetchQuery(api.users.listUserFinishedTalks, { limit }, { token: authToken });

  return {
    continueCursor: null,
    isDone: true,
    talks: result ?? [],
  };
}
