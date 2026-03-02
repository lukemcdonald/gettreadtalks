'use server';

import { api } from '@/convex/_generated/api';
import { fetchAuthQuery } from '@/services/auth/server';

/**
 * Get clip by slug with speaker and talk.
 */
export async function getClipBySlug(slug: string) {
  return await fetchAuthQuery(api.clips.getClipBySlug, { slug });
}
