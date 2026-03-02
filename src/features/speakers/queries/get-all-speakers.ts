'use server';

import { api } from '@/convex/_generated/api';
import { fetchAuthQuery } from '@/services/auth/server';

interface GetAllSpeakersProps {
  limit?: number;
}

/**
 * Get all speakers.
 */
export async function getAllSpeakers(args?: GetAllSpeakersProps) {
  const { limit } = args ?? {};

  const paginationOpts = {
    cursor: null,
    numItems: limit ?? 1000,
  };

  const result = await fetchAuthQuery(api.speakers.listAllSpeakers, { paginationOpts });

  return {
    continueCursor: result.continueCursor,
    isDone: result.isDone,
    speakers: result.page,
  };
}
