'use server';

import type { StatusType } from '@/convex/lib/validators/shared';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken, getCurrentUser } from '@/services/auth/server';
import { isAdmin } from '@/services/auth/utils';

type GetTalksWithSpeakersProps = {
  limit?: number;
  status?: StatusType;
};

/**
 * Get talks with speakers. Returns all talks matching the status filter.
 * Client-side filtering should be used for speaker, topic, featured, and search.
 *
 * For security: Non-admin users will only see published talks (enforced here).
 *
 * @param status - Filter by status (defaults to 'published')
 * @param limit - Maximum number of talks to return (defaults to 1000)
 */
export async function getTalksWithSpeakers(args?: GetTalksWithSpeakersProps) {
  const { limit, status } = args ?? {};

  const token = await getAuthToken();
  const user = await getCurrentUser();

  const effectiveStatus = isAdmin(user) ? status : 'published';

  const talks = await fetchQuery(
    api.talks.listTalksWithSpeakers,
    {
      limit,
      status: effectiveStatus,
    },
    { token },
  );

  return talks;
}
