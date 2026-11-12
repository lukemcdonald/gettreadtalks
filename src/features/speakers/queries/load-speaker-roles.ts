'use cache';

import { fetchQuery } from 'convex/nextjs';
import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';

/**
 * Published speaker count and roles in use.
 */
export async function loadSpeakerRoles() {
  cacheLife('hours');
  cacheTag('speakers');

  return await fetchQuery(api.speakers.listSpeakerRoles, {});
}
