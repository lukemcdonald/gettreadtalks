'use cache';

import { fetchQuery } from 'convex/nextjs';
import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';

/**
 * Public talk detail. Unpublished talks are omitted so this cache is shared.
 */
export async function getTalkBySlug(speakerSlug: string, talkSlug: string) {
  cacheLife('hours');
  cacheTag('talks');

  return await fetchQuery(api.talks.getTalkBySlug, {
    speakerSlug,
    talkSlug,
  });
}
