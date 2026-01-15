'use server';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

type GetAllSpeakersProps = {
  limit?: number;
};

/**
 * Get all speakers.
 */
export async function getAllSpeakers(args?: GetAllSpeakersProps) {
  const { limit } = args ?? {};

  const token = await getAuthToken();

  const paginationOpts = {
    cursor: null,
    numItems: limit ?? 1000,
  };

  const result = await fetchQuery(api.speakers.listAllSpeakers, { paginationOpts }, { token });

  return {
    continueCursor: result.continueCursor,
    isDone: result.isDone,
    speakers: result.page,
  };
}
