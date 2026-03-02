'use cache: private';

import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { fetchAuthQuery } from '@/services/auth/server';

export async function getUserFavorites(limit?: number) {
  cacheLife('hours');
  cacheTag('user-favorites');

  return await fetchAuthQuery(api.users.listUserFavorites, { limit });
}
