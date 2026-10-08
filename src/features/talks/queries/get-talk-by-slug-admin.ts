'use cache: private';

import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { fetchAuthQuery } from '@/services/auth/server';

/**
 * Admin draft preview. Per-user because it reads the auth token.
 */
export async function getTalkBySlugAdmin(
  speakerSlug: string,
  talkSlug: string
) {
  cacheLife('hours');
  cacheTag('talks');

  return await fetchAuthQuery(api.talks.getTalkBySlug, {
    speakerSlug,
    talkSlug,
  });
}
