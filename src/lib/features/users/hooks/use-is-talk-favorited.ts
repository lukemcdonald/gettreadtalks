'use client';

import type { Id } from '@/convex/_generated/dataModel';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';

export function useIsTalkFavorited(talkId: Id<'talks'>) {
  const data = useQuery(api.users.isTalkFavorited, { talkId });

  return {
    data: data ?? false,
    isLoading: data === undefined,
  };
}
