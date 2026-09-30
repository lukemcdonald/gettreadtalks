'use client';

import type { Speaker } from '@/features/speakers/types';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import { useMutation, useOptimisticToggle } from '@/hooks';
import { speakerTrackProps, track } from '@/lib/analytics';

export function useToggleSpeakerFavorited({
  speaker,
}: {
  speaker: Pick<Speaker, '_id' | 'slug'>;
}) {
  const speakerId = speaker._id;
  const data = useQuery(api.users.isSpeakerFavorited, { speakerId });

  const { clearOptimistic, isActive, isLoading, toggle } = useOptimisticToggle({
    data,
    onToggle: (next) => {
      const properties = speakerTrackProps(speaker);

      if (next) {
        favorite.mutate({ speakerId });
        track('speaker_favorited', properties);
      } else {
        unfavorite.mutate({ speakerId });
        track('speaker_unfavorited', properties);
      }
    },
  });

  const favorite = useMutation(api.users.favoriteSpeaker, {
    onError: clearOptimistic,
  });

  const unfavorite = useMutation(api.users.unfavoriteSpeaker, {
    onError: clearOptimistic,
  });

  return { isFavorited: isActive, isLoading, toggle };
}
