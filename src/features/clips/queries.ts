'use server';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

/**
 * Get clips with speakers for list page.
 */
export async function getClipsWithSpeakers({ limit }: { limit?: number } = {}) {
  const token = await getAuthToken();

  const paginationOpts = {
    cursor: null,
    numItems: limit ?? 1000,
  };

  const result = await fetchQuery(
    api.clips.listClipsWithSpeakers,
    { paginationOpts, status: 'published' },
    { token },
  );

  return {
    clips: result.page,
    continueCursor: result.continueCursor,
    isDone: result.isDone,
  };
}

/**
 * Get clip by slug with speaker and talk.
 */
export async function getClipBySlug(slug: string) {
  const token = await getAuthToken();

  return await fetchQuery(api.clips.getClipBySlug, { slug }, { token });
}
