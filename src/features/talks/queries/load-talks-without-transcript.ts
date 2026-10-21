'use cache: private';

import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { fetchAuthQuery } from '@/services/auth/server';

export async function loadTalksWithoutTranscript() {
  cacheLife('hours');
  cacheTag('talks');

  return await fetchAuthQuery(api.talks.listTalksWithoutTranscript, {
    status: 'published',
  });
}
