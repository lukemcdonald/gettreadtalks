'use server';

import type { StatusType } from '@/convex/lib/validators/shared';
import type { SpeakerId } from '@/features/speakers/types';
import type { TopicId } from '@/features/topics/types';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken, getCurrentUser } from '@/services/auth/server';
import { isAdmin } from '@/services/auth/utils';

type GetTalksWithSpeakersProps = {
  cursor?: string | null;
  featured?: boolean;
  limit?: number;
  search?: string;
  speakerId?: SpeakerId;
  status?: StatusType;
  topicId?: TopicId;
};

/**
 * Get talks with speakers for list page.
 * - General users can only see published talks.
 * - Admin users can filter by status via the status parameter.
 * - Supports server-side filtering: search, speaker, topic, featured
 * - Supports pagination via cursor
 */
export async function getTalksWithSpeakers(args?: GetTalksWithSpeakersProps) {
  const { cursor, featured, limit, search, speakerId, status, topicId } = args ?? {};

  const token = await getAuthToken();
  const user = await getCurrentUser();

  const fetchArgs = {
    featured,
    paginationOpts: { cursor: cursor || null, numItems: limit ?? 20 },
    search,
    speakerId,
    status: isAdmin(user) ? status : 'published',
    topicId,
  };

  const result = await fetchQuery(api.talks.listTalksWithSpeakers, fetchArgs, { token });

  return {
    continueCursor: result.continueCursor,
    isDone: result.isDone,
    talks: result.page,
  };
}
