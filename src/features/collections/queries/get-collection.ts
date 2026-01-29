'use server';

import type { CollectionId } from '../types';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

export async function getCollection(id: CollectionId) {
  const token = await getAuthToken();

  return fetchQuery(api.collections.getCollection, { collectionId: id }, { token });
}
