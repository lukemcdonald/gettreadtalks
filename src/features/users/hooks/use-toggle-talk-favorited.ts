'use client';

import type { TalkId } from '@/features/talks/types';

import { useState } from 'react';
import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/hooks';
import { useAnalytics } from '@/lib/analytics';

export function useToggleTalkFavorited(talkId: TalkId) {
  const data = useQuery(api.users.isTalkFavorited, { talkId });
  const [optimisticState, setOptimisticState] = useState<boolean | null>(null);
  const { track } = useAnalytics();

  const clearOptimistic = () => setOptimisticState(null);

  const favorite = useMutation(api.users.favoriteTalk, {
    onError: clearOptimistic,
    onSuccess: clearOptimistic,
  });

  const unfavorite = useMutation(api.users.unfavoriteTalk, {
    onError: clearOptimistic,
    onSuccess: clearOptimistic,
  });

  const isFavorited = optimisticState ?? data ?? false;
  const isLoading = data === undefined;

  const toggle = () => {
    setOptimisticState(!isFavorited);

    if (isFavorited) {
      unfavorite.mutate({ talkId });
      track('talk_unfavorited', { talk_id: talkId });
    } else {
      favorite.mutate({ talkId });
      track('talk_favorited', { talk_id: talkId });
    }
  };

  return { isFavorited, isLoading, toggle };
}
