'use cache: private';

import type { CollectionId } from '../types';

import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { fetchAuthQuery } from '@/services/auth/server';

export async function getCollection(id: CollectionId) {
  cacheLife('hours');
  cacheTag('collections');

  return await fetchAuthQuery(api.collections.getCollection, { collectionId: id });
}
