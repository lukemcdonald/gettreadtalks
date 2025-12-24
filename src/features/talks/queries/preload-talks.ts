'use server';

import { preloadQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

/**
 * Preload talks for home page with pagination.
 */
export async function preloadTalks(pageSize = 12) {
  const token = await getAuthToken();

  const paginationOpts = {
    cursor: null,
    numItems: pageSize,
  };

  return await preloadQuery(api.talks.listTalks, { paginationOpts }, { token });
}
