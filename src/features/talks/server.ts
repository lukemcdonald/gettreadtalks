'use server';

import type { StatusType } from '@/convex/lib/validators/shared';
import type { SpeakerId } from '@/features/speakers/types';
import type { TopicId } from '@/features/topics/types';

import { fetchQuery, preloadQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

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
 * Get talks with speakers and optional filters and pagination.
 */
export async function getTalksWithSpeakers(filters?: {
  cursor?: string | null;
  featured?: boolean;
  limit?: number;
  search?: string;
  speakerId?: SpeakerId;
  status?: StatusType;
  topicId?: TopicId;
}) {
  const token = await getAuthToken();

  const paginationOpts = {
    cursor: filters?.cursor || null,
    numItems: filters?.limit ?? 1000,
  };

  const result = await fetchQuery(
    api.talks.listTalksWithSpeakers,
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

  return {
    continueCursor: result.continueCursor,
    isDone: result.isDone,
    talks: result.page,
  };
}

/**
 * Get speakers for filter dropdowns.
 */
export async function getSpeakersForFilter() {
  const token = await getAuthToken();

  const paginationOpts = {
    cursor: null,
    numItems: 1000,
  };

  const result = await fetchQuery(api.speakers.listSpeakers, { paginationOpts }, { token });

  return result.page;
}

/**
 * Get topics for filter dropdowns.
 */
export async function getTopicsForFilter() {
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
 * Get speakers for form dropdowns.
 */
export async function getSpeakers({ limit }: { limit?: number } = {}) {
  const token = await getAuthToken();

  const paginationOpts = {
    cursor: null,
    numItems: limit ?? 1000,
  };

  const result = await fetchQuery(api.speakers.listSpeakers, { paginationOpts }, { token });

  return {
    speakers: result.page,
    continueCursor: result.continueCursor,
    isDone: result.isDone,
  };
}

/**
 * Get collections for form dropdowns.
 */
export async function getCollections({ limit }: { limit?: number } = {}) {
  const token = await getAuthToken();

  const paginationOpts = {
    cursor: null,
    numItems: limit ?? 1000,
  };

  const result = await fetchQuery(api.collections.listCollections, { paginationOpts }, { token });

  return {
    collections: result.page,
    continueCursor: result.continueCursor,
    isDone: result.isDone,
  };
}

/**
 * Get featured talks for homepage.
 */
export async function getFeaturedTalks(limit = 6) {
  const token = await getAuthToken();

  return await fetchQuery(api.talks.listFeaturedTalksWithSpeakers, { limit }, { token });
}
