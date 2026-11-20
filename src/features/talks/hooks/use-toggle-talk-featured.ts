'use client';

import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { updateTalkFeaturedAction } from '@/features/talks/actions/update-talk-featured';
import { useOptimisticToggle } from '@/hooks';
import { buildTalkTrackProps, track } from '@/services/analytics';

export function useToggleTalkFeatured({
  speaker,
  talk,
}: {
  speaker?: Pick<Speaker, '_id' | 'slug'> | null;
  talk: Pick<Talk, '_id' | 'featured' | 'slug'>;
}) {
  const talkId = talk._id;

  async function setFeatured(next: boolean) {
    try {
      const result = await updateTalkFeaturedAction(talkId, next);

      if (!result.success) {
        clearOptimistic();
        return;
      }

      track(
        next ? 'talk_featured' : 'talk_unfeatured',
        buildTalkTrackProps(talk, speaker)
      );
    } catch {
      clearOptimistic();
    }
  }

  const { clearOptimistic, isActive, isLoading, toggle } = useOptimisticToggle({
    data: talk.featured ?? false,
    onToggle: (next) => {
      void setFeatured(next);
    },
  });

  return { isFeatured: isActive, isLoading, toggle };
}
