'use server';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

/**
 * Get clip by slug with speaker and talk.
 */
export async function getClipBySlug(slug: string) {
  const token = await getAuthToken();

  return await fetchQuery(api.clips.getClipBySlug, { slug }, { token });
}
