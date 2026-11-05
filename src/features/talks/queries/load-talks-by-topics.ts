'use cache';

import type { TalkId } from '@/features/talks/types';
import type { TopicId } from '@/features/topics/types';

import { fetchQuery } from 'convex/nextjs';
import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';

/**
 * Get published talks that share any of the given topics.
 */
export async function loadTalksByTopics(
  topicIds: TopicId[],
  excludeTalkIds: TalkId[] = [],
  limit = 4
) {
  cacheLife('hours');
  cacheTag('talks');

  if (topicIds.length === 0) {
    return [];
  }

  return await fetchQuery(api.talks.listTalksByTopics, {
    excludeTalkIds,
    limit,
    topicIds,
  });
}
