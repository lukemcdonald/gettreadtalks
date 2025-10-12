'use client';

import { useQuery } from 'convex/react';

import type { Id } from '@/convex/_generated/dataModel';

import { api } from '@/convex/_generated/api';

export function useTalksByCollection(collectionId: Id<'collections'>, limit?: number) {
  const data = useQuery(api.talks.listByCollection, { collectionId, limit });

  return {
    data: data ?? [],
    isLoading: data === undefined,
  };
}
