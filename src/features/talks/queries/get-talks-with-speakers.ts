'use server';

import type { StatusType } from '@/convex/lib/validators/shared';
import type { SpeakerId } from '@/features/speakers/types';
import type { TopicId } from '@/features/topics/types';

import { fetchQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/services/auth/server';

/**
 * Get talks with speakers and optional filters and pagination.
 */
export async function getTalksWithSpeakers(filters?: {
  cursor?: string | null;
  featured?: boolean;
  limit?: number;
  search?: string;
  speakerId?: SpeakerId;
  status?: StatusType;
  topicId?: TopicId;
}) {
  const token = await getAuthToken();

  const paginationOpts = {
    cursor: filters?.cursor || null,
    numItems: filters?.limit ?? 1000,
  };

  const result = await fetchQuery(
    api.talks.listTalksWithSpeakers,
    {
      featured: filters?.featured,
      paginationOpts,
      search: filters?.search,
      speakerId: filters?.speakerId,
      status: filters?.status,
      topicId: filters?.topicId,
    },
    { token },
  );

  return {
    continueCursor: result.continueCursor,
    isDone: result.isDone,
    talks: result.page,
  };
}
