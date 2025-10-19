'use client';

import type { Id } from '@/convex/_generated/dataModel';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';

export function useRandomTalksBySpeaker(speakerId: Id<'speakers'>, limit?: number) {
  const data = useQuery(api.talks.listRandomBySpeaker, { limit, speakerId });

  return {
    data: data ?? [],
    isLoading: data === undefined,
  };
}
