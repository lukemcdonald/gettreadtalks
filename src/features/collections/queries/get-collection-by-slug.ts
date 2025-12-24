'use server';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

/**
 * Get collection by slug with talks in order.
 */
export async function getCollectionBySlug(slug: string) {
  const token = await getAuthToken();

  return await fetchQuery(api.collections.getCollectionBySlug, { slug }, { token });
}
