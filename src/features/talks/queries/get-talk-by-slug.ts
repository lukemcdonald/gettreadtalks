'use cache: private';

import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import { fetchAuthQuery } from '@/services/auth/server';

/**
 * Get talk by speaker slug and talk slug with all related data (speaker, collection, clips, topics).
 */
export async function getTalkBySlug(speakerSlug: string, talkSlug: string) {
  cacheLife('hours');
  cacheTag('talks');

  return await fetchAuthQuery(api.talks.getTalkBySlug, { speakerSlug, talkSlug });
}
