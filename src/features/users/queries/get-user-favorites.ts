'use server';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

/**
 * Get user favorites server-side.
 *
 * @param limit - Maximum number of favorites to return
 * @returns User favorites or null if not authenticated
 */
export async function getUserFavorites(limit?: number) {
  const authToken = await getAuthToken();

  if (!authToken) {
    return null;
  }

  return await fetchQuery(api.users.listUserFavorites, { limit }, { token: authToken });
}
