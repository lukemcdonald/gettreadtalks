'use server';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

type GetSpeakersWithPublishedTalksProps = {
  limit?: number;
};

/**
 * Get speakers with at least one published talk.
 * Used for public-facing pages and selects.
 */
export async function getSpeakersWithPublishedTalks(args?: GetSpeakersWithPublishedTalksProps) {
  const { limit } = args ?? {};

  const token = await getAuthToken();

  const paginationOpts = {
    cursor: null,
    numItems: limit ?? 1000,
  };

  const result = await fetchQuery(
    api.speakers.listSpeakersWithPublishedTalks,
    { paginationOpts },
    { token },
  );

  return {
    continueCursor: result.continueCursor,
    isDone: result.isDone,
    speakers: result.page,
  };
}
