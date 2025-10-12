'use client';

import { useQuery } from 'convex/react';

import type { Id } from '@/convex/_generated/dataModel';

import { api } from '@/convex/_generated/api';

export function useTalksBySpeaker(speakerId: Id<'speakers'>, limit?: number) {
  const data = useQuery(api.talks.listBySpeaker, { limit, speakerId });

  return {
    data: data ?? [],
    isLoading: data === undefined,
  };
}
