'use cache: private';

import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { fetchAuthQuery } from '@/services/auth/server';

export async function getUserFinishedTalks(limit?: number) {
  cacheLife('hours');
  cacheTag('user-finished-talks');

  const result = await fetchAuthQuery(api.users.listUserFinishedTalks, { limit });

  return {
    continueCursor: null,
    isDone: true,
    talks: result ?? [],
  };
}
