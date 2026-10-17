'use cache';

import { fetchQuery } from 'convex/nextjs';
import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';

export async function loadCollectionBySlug(slug: string) {
  cacheLife('hours');
  cacheTag('collections');

  return await fetchQuery(api.collections.getCollectionBySlug, { slug });
}
