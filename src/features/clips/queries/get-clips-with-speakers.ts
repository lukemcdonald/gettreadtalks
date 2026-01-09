'use server';

import type { StatusType } from '@/convex/lib/validators/shared';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken, getCurrentUser } from '@/services/auth/server';
import { isAdmin } from '@/services/auth/utils';

type GetClipsWithSpeakersProps = {
  limit?: number;
  status?: StatusType;
};

/**
 * Get clips with speakers for list page.
 * - General users can only see published clips with published parent talks.
 * - Admin users can filter by status via the status parameter.
 */
export async function getClipsWithSpeakers(args?: GetClipsWithSpeakersProps) {
  const { limit, status } = args ?? {};

  const token = await getAuthToken();
  const user = await getCurrentUser();

  const fetchArgs = {
    paginationOpts: { cursor: null, numItems: limit ?? 1000 },
    status: isAdmin(user) ? status : 'published',
  };

  const result = await fetchQuery(api.clips.listClipsWithSpeakersAndPublishedTalks, fetchArgs, {
    token,
  });

  return {
    clips: result.page,
    continueCursor: result.continueCursor,
    isDone: result.isDone,
  };
}
