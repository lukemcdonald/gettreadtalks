'use client';

import { useQuery } from 'convex/react';

import type { Id } from '@/convex/_generated/dataModel';

import { api } from '@/convex/_generated/api';

export function useIsTalkFinished(talkId: Id<'talks'>) {
  const data = useQuery(api.users.isTalkFinished, { talkId });

  return {
    data: data ?? false,
    isLoading: data === undefined,
  };
}
