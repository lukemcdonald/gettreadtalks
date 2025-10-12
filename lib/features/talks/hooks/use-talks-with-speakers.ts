'use client';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';

export function useTalksWithSpeakers(limit?: number) {
  const data = useQuery(api.talks.listWithSpeakers, { limit });

  return {
    data: data ?? [],
    isLoading: data === undefined,
  };
}
