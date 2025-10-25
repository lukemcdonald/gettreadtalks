'use client';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';

export function useTalksCount() {
  const data = useQuery(api.talks.getTalksCount);

  return {
    data: data ?? 0,
    isLoading: data === undefined,
  };
}
