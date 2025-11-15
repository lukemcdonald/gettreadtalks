'use server';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/lib/services/auth/server';

/**
 * Get all clips with speakers for list page.
 */
export async function getAllClips() {
  const token = await getAuthToken();

  const paginationOpts = {
    cursor: null,
    numItems: 1000,
  };

  const result = await fetchQuery(
    api.clips.listClips,
    { paginationOpts, status: 'published' },
    { token },
  );

  // Fetch speakers for each clip
  const clipsWithSpeakers = await Promise.all(
    result.page.map(async (clip) => {
      const speaker = clip.speakerId
        ? await fetchQuery(api.speakers.getSpeaker, { id: clip.speakerId }, { token })
        : null;
      return {
        ...clip,
        speaker,
      };
    }),
  );

  return clipsWithSpeakers;
}

/**
 * Get clips with speakers for list page.
 */
export async function getClips(pageSize = 12) {
  const token = await getAuthToken();

  const paginationOpts = {
    cursor: null,
    numItems: pageSize,
  };

  const result = await fetchQuery(
    api.clips.listClips,
    { paginationOpts, status: 'published' },
    { token },
  );

  // Fetch speakers for each clip
  const clipsWithSpeakers = await Promise.all(
    result.page.map(async (clip) => {
      const speaker = clip.speakerId
        ? await fetchQuery(api.speakers.getSpeaker, { id: clip.speakerId }, { token })
        : null;
      return {
        ...clip,
        speaker,
      };
    }),
  );

  return {
    clips: clipsWithSpeakers,
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
