'use server';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

/**
 * Get all collections with stats (talk counts and speakers) for list page.
 */
export async function getAllCollectionsWithStats() {
  const token = await getAuthToken();

  const paginationOpts = {
    cursor: null,
    numItems: 1000,
  };

  return await fetchQuery(api.collections.listCollectionsWithStats, { paginationOpts }, { token });
}

/**
 * Get collections with stats (talk counts and speakers) for list page.
 */
export async function getCollectionsWithStats(pageSize = 12) {
  const token = await getAuthToken();

  const paginationOpts = {
    cursor: null,
    numItems: pageSize,
  };

  return await fetchQuery(api.collections.listCollectionsWithStats, { paginationOpts }, { token });
}

/**
 * Get collection by slug with talks in order.
 */
export async function getCollectionBySlug(slug: string) {
  const token = await getAuthToken();

  const collection = await fetchQuery(api.collections.getCollectionBySlug, { slug }, { token });

  if (!collection) {
    return null;
  }

  const result = await fetchQuery(
    api.collections.getCollectionWithTalks,
    { id: collection._id },
    { token },
  );

  if (!result) {
    return null;
  }

  // Fetch speakers for each talk
  const talksWithSpeakers = await Promise.all(
    result.talks.map(async (talk) => {
      const speaker = await fetchQuery(api.speakers.getSpeaker, { id: talk.speakerId }, { token });
      return {
        ...talk,
        speaker,
      };
    }),
  );

  return {
    collection: result.collection,
    talks: talksWithSpeakers,
  };
}
