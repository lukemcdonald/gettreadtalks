'use cache: private';

import type { CollectionId } from '../types';

import { fetchQuery } from 'convex/nextjs';
import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

export async function getCollection(id: CollectionId) {
  cacheLife('hours');
  cacheTag('collections');

  const token = await getAuthToken();

  return fetchQuery(api.collections.getCollection, { collectionId: id }, { token });
}
