'use client';

import { useQuery } from 'convex/react';

import type { Id } from '@/convex/_generated/dataModel';

import { api } from '@/convex/_generated/api';

export function useRandomTalksBySpeaker(speakerId: Id<'speakers'>, count?: number) {
  const data = useQuery(api.talks.getRandomBySpeaker, { count, speakerId });

  return {
    data: data ?? [],
    isLoading: data === undefined,
  };
}
