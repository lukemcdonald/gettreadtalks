'use cache';

import { fetchQuery } from 'convex/nextjs';
import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';

/**
 * Get speaker by slug with related talks, collections, and clips.
 */
export async function getSpeakerBySlug(slug: string) {
  cacheLife('hours');
  cacheTag('speakers');

  return await fetchQuery(api.speakers.getSpeakerBySlug, { slug });
}
