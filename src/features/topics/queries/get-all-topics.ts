'use cache: private';

import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { fetchAuthQuery } from '@/services/auth/server';

export async function getAllTopics() {
  cacheLife('hours');
  cacheTag('topics');

  const topics = await fetchAuthQuery(api.topics.listAllTopics, {});

  return { topics };
}
