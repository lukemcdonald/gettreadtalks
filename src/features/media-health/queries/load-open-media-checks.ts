'use cache: private';

import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { fetchAuthQuery } from '@/services/auth/server';

export async function loadOpenMediaChecks() {
  cacheLife('hours');
  cacheTag('media-health');

  return await fetchAuthQuery(api.mediaHealth.listOpenMediaChecks, {});
}
