'use cache';

import type { SpeakerId } from '@/features/speakers/types';
import type { TalkId } from '@/features/talks/types';

import { fetchQuery } from 'convex/nextjs';
import { cacheLife, cacheTag } from 'next/cache';

import { api } from '@/convex/_generated/api';

/**
 * Get random talks by speaker (excluding specified talk).
 */
export async function getRandomTalksBySpeaker(
  speakerId: SpeakerId,
  excludeTalkId?: TalkId,
  limit = 5,
) {
  cacheLife('hours');
  cacheTag('talks');

  return await fetchQuery(api.talks.listRandomTalksBySpeaker, {
    excludeTalkId,
    limit,
    speakerId,
  });
}
