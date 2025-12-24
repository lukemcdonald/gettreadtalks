'use server';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

/**
 * Get talk by speaker slug and talk slug with all related data (speaker, collection, clips, topics).
 *
 * @param speakerSlug - Speaker slug identifier
 * @param talkSlug - Talk slug identifier
 * @returns Talk data with relations or null if not found
 */
export async function getTalkBySlug(speakerSlug: string, talkSlug: string) {
  const token = await getAuthToken();

  return await fetchQuery(api.talks.getTalkBySlug, { speakerSlug, talkSlug }, { token });
}
