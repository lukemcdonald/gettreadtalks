'use client';

import { useQuery } from 'convex/react';

import type { Id } from '@/convex/_generated/dataModel';

import { api } from '@/convex/_generated/api';

export function useIsClipFavorited(clipId: Id<'clips'>) {
  const data = useQuery(api.users.isClipFavorited, { clipId });

  return {
    data: data ?? false,
    isLoading: data === undefined,
  };
}
