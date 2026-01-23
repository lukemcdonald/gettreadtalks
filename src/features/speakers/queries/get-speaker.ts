'use server';

import type { SpeakerId } from '../types';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

export async function getSpeaker(id: SpeakerId) {
  const token = await getAuthToken();
  return fetchQuery(api.speakers.getSpeaker, { speakerId: id }, { token });
}
