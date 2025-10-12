'use client';

import { useQuery } from 'convex/react';

import type { Id } from '@/convex/_generated/dataModel';

import { api } from '@/convex/_generated/api';

export function useTalk(id: Id<'talks'>) {
  const data = useQuery(api.talks.get, { id });

  return {
    data,
    isLoading: data === undefined,
    notFound: data === null,
  };
}
