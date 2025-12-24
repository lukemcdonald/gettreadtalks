'use server';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

/**
 * Get speaker by slug with related talks, collections, and clips.
 */
export async function getSpeakerBySlug(slug: string) {
  const token = await getAuthToken();

  return await fetchQuery(api.speakers.getSpeakerBySlug, { slug }, { token });
}
