'use server';

import type { StatusType } from '@/convex/lib/validators/shared';
import type { SpeakerId } from '@/lib/features/speakers/types';
import type { TopicId } from '@/lib/features/topics/types';

import { fetchQuery, preloadQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/lib/services/auth/server';

/**
 * Preload talks for home page with pagination.
 */
export async function preloadTalks(pageSize = 12) {
  const token = await getAuthToken();

  const paginationOpts = {
    cursor: null,
    numItems: pageSize,
  };

  return await preloadQuery(api.talks.listTalks, { paginationOpts }, { token });
}

/**
 * Get talks with optional filters and pagination.
 */
export async function getTalks(filters?: {
  cursor?: string | null;
  featured?: boolean;
  pageSize?: number;
  search?: string;
  speakerId?: SpeakerId;
  status?: StatusType;
  topicId?: TopicId;
}) {
  const token = await getAuthToken();

  const paginationOpts = {
    cursor: filters?.cursor || null,
    numItems: filters?.pageSize || 20,
  };

  const result = await fetchQuery(
    api.talks.listTalks,
    {
      featured: filters?.featured,
      paginationOpts,
      search: filters?.search,
      speakerId: filters?.speakerId,
      status: filters?.status,
      topicId: filters?.topicId,
    },
    { token },
  );

  // Fetch speakers for each talk
  const talksWithSpeakers = await Promise.all(
    result.page.map(async (talk) => {
      const speaker = await fetchQuery(api.speakers.getSpeaker, { id: talk.speakerId }, { token });
      return { ...talk, speaker };
    }),
  );

  return {
    continueCursor: result.continueCursor,
    isDone: result.isDone,
    talks: talksWithSpeakers,
  };
}

/**
 * Get all speakers for filter dropdowns.
 */
export async function getAllSpeakersForFilter() {
  const token = await getAuthToken();

  const paginationOpts = {
    cursor: null,
    numItems: 1000,
  };

  const result = await fetchQuery(api.speakers.listSpeakers, { paginationOpts }, { token });

  return result.page;
}

/**
 * Get all topics for filter dropdowns.
 */
export async function getAllTopicsForFilter() {
  const token = await getAuthToken();

  return await fetchQuery(api.topics.listTopics, { limit: 1000 }, { token });
}

/**
 * Get talk by slug with all related data (speaker, collection, clips, topics).
 *
 * @param slug - Talk slug identifier
 * @returns Talk data with relations or null if not found
 */
export async function getTalkBySlug(slug: string) {
  const token = await getAuthToken();

  return await fetchQuery(api.talks.getTalkBySlug, { slug }, { token });
}

/**
 * Get all speakers for form dropdowns.
 */
export async function getAllSpeakers() {
  const token = await getAuthToken();

  const paginationOpts = {
    cursor: null,
    numItems: 1000, // Large number to get all speakers
  };

  const result = await fetchQuery(api.speakers.listSpeakers, { paginationOpts }, { token });

  return result.page;
}

/**
 * Get all collections for form dropdowns.
 */
export async function getAllCollections() {
  const token = await getAuthToken();

  const paginationOpts = {
    cursor: null,
    numItems: 1000, // Large number to get all collections
  };

  const result = await fetchQuery(api.collections.listCollections, { paginationOpts }, { token });

  return result.page;
}

/**
 * Get featured talks for homepage.
 */
export async function getFeaturedTalks(limit = 5) {
  const token = await getAuthToken();

  const talks = await fetchQuery(api.talks.listFeaturedTalks, { limit }, { token });

  // Fetch speakers for each talk
  const talksWithSpeakers = await Promise.all(
    talks.map(async (talk) => {
      const speaker = await fetchQuery(api.speakers.getSpeaker, { id: talk.speakerId }, { token });

      return {
        ...talk,
        speaker,
      };
    }),
  );

  return talksWithSpeakers;
}
