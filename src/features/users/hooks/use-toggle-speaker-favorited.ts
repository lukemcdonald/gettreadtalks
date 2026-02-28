'use client';

import type { SpeakerId } from '@/features/speakers/types';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import { useMutation, useOptimisticToggle } from '@/hooks';
import { useAnalytics } from '@/lib/analytics';

export function useToggleSpeakerFavorited(speakerId: SpeakerId) {
  const data = useQuery(api.users.isSpeakerFavorited, { speakerId });
  const { track } = useAnalytics();

  const { clearOptimistic, isActive, isLoading, toggle } = useOptimisticToggle({
    data,
    onToggle: (next) => {
      if (next) {
        favorite.mutate({ speakerId });
        track('speaker_favorited', { speaker_id: speakerId });
      } else {
        unfavorite.mutate({ speakerId });
        track('speaker_unfavorited', { speaker_id: speakerId });
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
