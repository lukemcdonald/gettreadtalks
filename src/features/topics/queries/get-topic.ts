'use cache: private';

import type { TopicId } from '../types';

import { fetchQuery } from 'convex/nextjs';
import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

export async function getTopic(id: TopicId) {
  cacheLife('hours');
  cacheTag('topics');

  const token = await getAuthToken();

  return fetchQuery(api.topics.getTopic, { id }, { token });
}
