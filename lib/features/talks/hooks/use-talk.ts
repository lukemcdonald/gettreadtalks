'use client';

import type { Id } from '@/convex/_generated/dataModel';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';

export function useTalk(id: Id<'talks'>) {
  const data = useQuery(api.talks.getTalk, { id });

  return {
    data,
    isLoading: data === undefined,
    notFound: data === null,
  };
}
