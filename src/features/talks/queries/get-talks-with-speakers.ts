'use server';

import type { StatusType } from '@/convex/lib/validators/shared';
import type { SpeakerId } from '@/features/speakers/types';
import type { TopicId } from '@/features/topics/types';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

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
 * Get talks with speakers and optional filters and pagination.
 */
export async function getTalksWithSpeakers(args?: GetTalksWithSpeakersProps) {
  const { cursor, featured, limit, search, speakerId, status, topicId } = args ?? {};

  const token = await getAuthToken();

  const paginationOpts = {
    cursor: cursor || null,
    numItems: limit ?? 1000,
  };

  const result = await fetchQuery(
    api.talks.listTalksWithSpeakers,
    {
      featured,
      paginationOpts,
      search,
      speakerId,
      status,
      topicId,
    },
    { token },
  );

  return {
    continueCursor: result.continueCursor,
    isDone: result.isDone,
    talks: result.page,
  };
}
