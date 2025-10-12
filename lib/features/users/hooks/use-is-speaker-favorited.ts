'use client';

import { useQuery } from 'convex/react';

import type { Id } from '@/convex/_generated/dataModel';

import { api } from '@/convex/_generated/api';

export function useIsSpeakerFavorited(speakerId: Id<'speakers'>) {
  const data = useQuery(api.users.isSpeakerFavorited, { speakerId });

  return {
    data: data ?? false,
    isLoading: data === undefined,
  };
}
