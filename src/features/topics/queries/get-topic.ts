'use cache: private';

import type { TopicId } from '../types';

import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { fetchAuthQuery } from '@/services/auth/server';

export async function getTopic(id: TopicId) {
  cacheLife('hours');
  cacheTag('topics');

  return await fetchAuthQuery(api.topics.getTopic, { id });
}
