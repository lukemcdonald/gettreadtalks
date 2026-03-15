'use cache: private';

import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { fetchAuthQuery } from '@/services/auth/server';

export async function getSpeakersAdmin() {
  cacheLife('hours');
  cacheTag('speakers');

  const speakers = await fetchAuthQuery(api.speakers.listAllSpeakersAdmin, {});

  return { speakers };
}
