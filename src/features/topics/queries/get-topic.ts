'use server';

import type { TopicId } from '../types';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

export async function getTopic(id: TopicId) {
  const token = await getAuthToken();

  return fetchQuery(api.topics.getTopic, { id }, { token });
}
