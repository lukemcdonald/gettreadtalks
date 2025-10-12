'use client';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';

export function useTalks(limit?: number) {
  const data = useQuery(api.talks.list, { limit });

  return {
    data: data ?? [],
    isLoading: data === undefined,
  };
}
