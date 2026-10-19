'use client';

import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { api } from '@/convex/_generated/api';
import { useMutation, useOptimisticToggle } from '@/hooks';
import { buildTalkTrackProps, track } from '@/services/analytics';

export function useToggleTalkFeatured({
  speaker,
  talk,
}: {
  speaker?: Pick<Speaker, '_id' | 'slug'> | null;
  talk: Pick<Talk, '_id' | 'featured' | 'slug'>;
}) {
  const talkId = talk._id;

  const { clearOptimistic, isActive, isLoading, toggle } = useOptimisticToggle({
    data: talk.featured ?? false,
    onToggle: async (next) => {
      try {
        await update.mutateAsync({ featured: next, talkId });
      } catch {
        return;
      }
      track(
        next ? 'talk_featured' : 'talk_unfeatured',
        buildTalkTrackProps(talk, speaker)
      );
    },
  });

  const update = useMutation(api.talks.updateTalk, {
    onError: clearOptimistic,
  });

  return { isFeatured: isActive, isLoading, toggle };
}
