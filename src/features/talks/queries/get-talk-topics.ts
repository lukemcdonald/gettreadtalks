'use cache: private';

import type { TalkId } from '../types';

import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { fetchAuthQuery } from '@/services/auth/server';

export async function getTalkTopics(talkId: TalkId) {
  cacheLife('hours');
  cacheTag('talks');
  cacheTag('topics');

  return await fetchAuthQuery(api.talks.listTalkTopics, { talkId });
}
