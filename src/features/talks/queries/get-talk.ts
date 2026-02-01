'use cache: private';

import type { TalkId } from '../types';

import { fetchQuery } from 'convex/nextjs';
import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

export async function getTalk(id: TalkId) {
  cacheLife('hours');
  cacheTag('talks');

  const token = await getAuthToken();

  return fetchQuery(api.talks.getTalk, { id }, { token });
}
