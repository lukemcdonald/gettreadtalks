'use client';

import type { SpeakerId } from '@/features/speakers/types';

import { useState } from 'react';
import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/hooks';
import { useAnalytics } from '@/lib/analytics';

export function useToggleSpeakerFavorited(speakerId: SpeakerId) {
  const data = useQuery(api.users.isSpeakerFavorited, { speakerId });
  const [optimisticState, setOptimisticState] = useState<boolean | null>(null);
  const { track } = useAnalytics();

  const clearOptimistic = () => setOptimisticState(null);

  const favorite = useMutation(api.users.favoriteSpeaker, {
    onError: clearOptimistic,
    onSuccess: clearOptimistic,
  });

  const unfavorite = useMutation(api.users.unfavoriteSpeaker, {
    onError: clearOptimistic,
    onSuccess: clearOptimistic,
  });

  const isFavorited = optimisticState ?? data ?? false;
  const isLoading = data === undefined;

  const toggle = () => {
    setOptimisticState(!isFavorited);

    if (isFavorited) {
      unfavorite.mutate({ speakerId });
      track('speaker_unfavorited', { speaker_id: speakerId });
    } else {
      favorite.mutate({ speakerId });
      track('speaker_favorited', { speaker_id: speakerId });
    }
  };

  return {
    isFavorited,
    isLoading,
    toggle,
  };
}
