'use server';

import { fetchQuery, preloadQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/lib/services/auth/server';

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

/**
 * Get talk by slug with all related data (speaker, collection, clips, topics).
 *
 * @param slug - Talk slug identifier
 * @returns Talk data with relations or null if not found
 */
export async function getTalkBySlug(slug: string) {
  const token = await getAuthToken();

  return await fetchQuery(api.talks.getTalkBySlug, { slug }, { token });
}
