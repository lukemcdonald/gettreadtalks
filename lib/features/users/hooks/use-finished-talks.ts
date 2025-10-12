'use client';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';

export function useFinishedTalks(limit?: number) {
  const data = useQuery(api.users.listFinished, { limit });

  return {
    data: data ?? [],
    isLoading: data === undefined,
  };
}
