'use cache';

import type { TalkId } from '@/features/talks/types';
import type { TopicId } from '@/features/topics/types';

import { fetchQuery } from 'convex/nextjs';
import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import {
  getTimeSeed,
  secondsUntilNextRotation,
} from '@/convex/lib/rotateContent';

/**
 * Get published talks that share any of the given topics.
 */
export async function loadTalksByTopics(
  topicIds: TopicId[],
  excludeTalkIds: TalkId[] = [],
  limit = 4
) {
  const expire = secondsUntilNextRotation('daily');

  cacheLife({
    expire,
    revalidate: expire,
    stale: expire,
  });
  cacheTag('talks');

  if (topicIds.length === 0) {
    return [];
  }

  return await fetchQuery(api.talks.listTalksByTopics, {
    excludeTalkIds,
    limit,
    seed: getTimeSeed('daily'),
    topicIds,
  });
}
