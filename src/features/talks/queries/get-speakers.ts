'use server';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

/**
 * Get speakers for form dropdowns.
 */
export async function getSpeakers({ limit }: { limit?: number } = {}) {
  const token = await getAuthToken();

  const paginationOpts = {
    cursor: null,
    numItems: limit ?? 1000,
  };

  const result = await fetchQuery(api.speakers.listSpeakers, { paginationOpts }, { token });

  return {
    continueCursor: result.continueCursor,
    isDone: result.isDone,
    speakers: result.page,
  };
}
