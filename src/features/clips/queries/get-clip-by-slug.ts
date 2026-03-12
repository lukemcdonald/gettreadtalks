'use cache: private';

import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { fetchAuthQuery } from '@/services/auth/server';

/**
 * Get clip by slug with speaker and talk.
 */
export async function getClipBySlug(slug: string) {
  cacheLife('hours');
  cacheTag('clips');

  return await fetchAuthQuery(api.clips.getClipBySlug, { slug });
}
