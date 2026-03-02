'use cache: private';

import type { ClipId } from '../types';

import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { fetchAuthQuery } from '@/services/auth/server';

export async function getClip(id: ClipId) {
  cacheLife('hours');
  cacheTag('clips');

  return await fetchAuthQuery(api.clips.getClip, { id });
}
