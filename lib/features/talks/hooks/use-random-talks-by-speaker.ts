'use client';

import { useQuery } from 'convex/react';

import type { Id } from '@/convex/_generated/dataModel';

import { api } from '@/convex/_generated/api';

export function useRandomTalksBySpeaker(speakerId: Id<'speakers'>, limit?: number) {
  const data = useQuery(api.talks.getRandomBySpeaker, { limit, speakerId });

  return {
    data: data ?? [],
    isLoading: data === undefined,
  };
}
