'use client';

import type { TalkId } from '@/features/talks';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';

export function useIsTalkFavorited(talkId: TalkId) {
  const data = useQuery(api.users.isTalkFavorited, { talkId });

  return {
    data: data ?? false,
    isLoading: data === undefined,
  };
}
