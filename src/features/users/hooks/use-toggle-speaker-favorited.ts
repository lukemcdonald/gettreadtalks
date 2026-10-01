'use client';

import type { Speaker } from '@/features/speakers/types';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import { useMutation, useOptimisticToggle } from '@/hooks';
import { speakerTrackProps, track } from '@/services/analytics';

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
      if (next) {
        favorite.mutate({ speakerId });
      } else {
        unfavorite.mutate({ speakerId });
      }
    },
  });

  const favorite = useMutation(api.users.favoriteSpeaker, {
    onError: clearOptimistic,
    onSuccess: () => track('speaker_favorited', speakerTrackProps(speaker)),
  });

  const unfavorite = useMutation(api.users.unfavoriteSpeaker, {
    onError: clearOptimistic,
    onSuccess: () => track('speaker_unfavorited', speakerTrackProps(speaker)),
  });

  return { isFavorited: isActive, isLoading, toggle };
}
