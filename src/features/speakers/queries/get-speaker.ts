'use cache: private';

import type { SpeakerId } from '../types';

import { fetchQuery } from 'convex/nextjs';
import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

export async function getSpeaker(id: SpeakerId) {
  cacheLife('hours');
  cacheTag('speakers');

  const token = await getAuthToken();

  return fetchQuery(api.speakers.getSpeaker, { speakerId: id }, { token });
}
