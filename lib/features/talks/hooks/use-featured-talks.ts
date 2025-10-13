'use client';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';

export function useFeaturedTalks(limit?: number) {
  const data = useQuery(api.talks.listFeatured, { limit });

  return {
    data: data ?? [],
    isLoading: data === undefined,
  };
}
