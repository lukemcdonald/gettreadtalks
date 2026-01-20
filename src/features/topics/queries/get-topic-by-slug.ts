'use server';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

interface GetTopicBySlugProps {
  cursor?: string;
  limit?: number;
  slug: string;
}

/**
 * Get topic by slug with associated talks (paginated).
 */
export async function getTopicBySlug(args: GetTopicBySlugProps) {
  const { cursor, limit = 50, slug } = args;
  const token = await getAuthToken();

  const result = await fetchQuery(
    api.topics.getTopicBySlug,
    {
      paginationOpts: {
        cursor: cursor || null,
        numItems: limit,
      },
      slug,
    },
    { token },
  );

  if (!result) {
    return null;
  }

  return {
    continueCursor: result.continueCursor,
    isDone: result.isDone,
    talks: result.page,
    topic: result.topic,
    totalTalks: result.totalTalks,
  };
}
