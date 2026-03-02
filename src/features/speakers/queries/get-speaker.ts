'use cache: private';

import type { SpeakerId } from '../types';

import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { fetchAuthQuery } from '@/services/auth/server';

export async function getSpeaker(id: SpeakerId) {
  cacheLife('hours');
  cacheTag('speakers');

  return await fetchAuthQuery(api.speakers.getSpeaker, { speakerId: id });
}
