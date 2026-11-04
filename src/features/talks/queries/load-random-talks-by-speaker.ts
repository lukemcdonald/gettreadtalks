'use cache';

import type { SpeakerId } from '@/features/speakers/types';
import type { TalkId } from '@/features/talks/types';

import { fetchQuery } from 'convex/nextjs';
import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';
import {
  getTimeSeed,
  secondsUntilNextRotation,
} from '@/convex/lib/rotateContent';

/**
 * Get random talks by speaker (excluding specified talk).
 */
export async function loadRandomTalksBySpeaker(
  speakerId: SpeakerId,
  excludeTalkId?: TalkId,
  limit = 5
) {
  const expire = secondsUntilNextRotation('daily');

  cacheLife({
    expire,
    revalidate: expire,
    stale: expire,
  });
  cacheTag('talks');

  return await fetchQuery(api.talks.listRandomTalksBySpeaker, {
    excludeTalkId,
    limit,
    seed: getTimeSeed('daily'),
    speakerId,
  });
}
