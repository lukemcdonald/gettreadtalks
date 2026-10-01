'use client';

import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import { useMutation, useOptimisticToggle } from '@/hooks';
import { talkTrackProps, track } from '@/services/analytics';

export function useToggleTalkFeatured({
  speaker,
  talk,
}: {
  speaker?: Pick<Speaker, '_id' | 'slug'> | null;
  talk: Pick<Talk, '_id' | 'slug'>;
}) {
  const talkId = talk._id;
  const talkDoc = useQuery(api.talks.getTalk, { id: talkId });

  const { clearOptimistic, isActive, isLoading, toggle } = useOptimisticToggle({
    data: talkDoc?.featured,
    onToggle: async (next) => {
      try {
        await update.mutateAsync({ featured: next, talkId });
      } catch {
        return;
      }
      track(
        next ? 'talk_featured' : 'talk_unfeatured',
        talkTrackProps(talk, speaker)
      );
    },
  });

  const update = useMutation(api.talks.updateTalk, {
    onError: clearOptimistic,
  });

  return { isFeatured: isActive, isLoading, toggle };
}
