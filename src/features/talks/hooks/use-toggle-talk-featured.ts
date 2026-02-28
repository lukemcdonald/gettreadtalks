'use client';

import type { TalkId } from '@/features/talks/types';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import { useMutation, useOptimisticToggle } from '@/hooks';
import { useAnalytics } from '@/lib/analytics';

export function useToggleTalkFeatured(talkId: TalkId) {
  const talk = useQuery(api.talks.getTalk, { id: talkId });
  const { track } = useAnalytics();

  const { clearOptimistic, isActive, isLoading, toggle } = useOptimisticToggle({
    data: talk?.featured,
    onToggle: (next) => {
      update.mutate({ featured: next, talkId });
      track(next ? 'talk_featured' : 'talk_unfeatured', { talk_id: talkId });
    },
  });

  const update = useMutation(api.talks.updateTalk, {
    onError: clearOptimistic,
  });

  return { isFeatured: isActive, isLoading, toggle };
}
