'use client';

import type { SpeakerId } from '@/features/speakers/types';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';

export function useTalksBySpeaker(speakerId: SpeakerId, limit?: number) {
  const data = useQuery(api.talks.listTalksBySpeaker, {
    limit,
    speakerId,
  });

  return {
    data: data ?? [],
    isLoading: data === undefined,
  };
}
