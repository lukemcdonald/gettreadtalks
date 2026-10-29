'use cache: private';

import type { TalkId } from '../types';

import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { fetchAuthQuery } from '@/services/auth/server';

export async function loadTalk(id: TalkId) {
  cacheLife('hours');
  cacheTag('talks');

  return await fetchAuthQuery(api.talks.getTalk, { id });
}

export async function loadTalkFeature(talkId: TalkId) {
  cacheLife('hours');
  cacheTag('talks');
  return await fetchAuthQuery(api.talkFeatures.get, {
    kind: 'study',
    talkId,
  });
}
