'use cache: private';

import type { ClipId } from '../types';

import { fetchQuery } from 'convex/nextjs';
import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

export async function getClip(id: ClipId) {
  cacheLife('hours');
  cacheTag('clips');

  const token = await getAuthToken();

  return fetchQuery(api.clips.getClip, { id }, { token });
}
