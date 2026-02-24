'use client';

import type { TalkId } from '@/features/talks/types';

import { useState } from 'react';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/hooks';
import { useAnalytics } from '@/lib/analytics';

export function useToggleTalkFeatured(talkId: TalkId, initialFeatured: boolean) {
  const [optimisticState, setOptimisticState] = useState<boolean | null>(null);
  const { track } = useAnalytics();

  const clearOptimistic = () => setOptimisticState(null);

  const update = useMutation(api.talks.updateTalk, {
    onError: clearOptimistic,
    onSuccess: clearOptimistic,
  });

  const isFeatured = optimisticState ?? initialFeatured;

  const toggle = () => {
    const next = !isFeatured;
    setOptimisticState(next);
    update.mutate({ featured: next, talkId });
    track(next ? 'talk_featured' : 'talk_unfeatured', { talk_id: talkId });
  };

  return { isFeatured, isLoading: update.isLoading, toggle };
}
