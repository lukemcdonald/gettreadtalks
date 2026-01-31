'use cache';

import { fetchQuery } from 'convex/nextjs';
import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';

interface GetTopicBySlugProps {
  cursor?: string;
  limit?: number;
  search?: string;
  slug: string;
}

/**
 * Get topic by slug with associated talks (paginated).
 */
export async function getTopicBySlug(args: GetTopicBySlugProps) {
  cacheLife('hours');
  cacheTag('topics');

  const { cursor, limit = 50, search, slug } = args;

  const paginationOpts = {
    cursor: cursor || null,
    numItems: limit,
  };

  const result = await fetchQuery(api.topics.getTopicBySlug, {
    paginationOpts,
    search,
    slug,
  });

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
