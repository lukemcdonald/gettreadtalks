'use client';

import type { TalkId } from '@/features/talks/types';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import { useMutation, useOptimisticToggle } from '@/hooks';
import { useAnalytics } from '@/lib/analytics';

export function useToggleTalkFavorited(talkId: TalkId) {
  const data = useQuery(api.users.isTalkFavorited, { talkId });
  const { track } = useAnalytics();

  const { clearOptimistic, isActive, isLoading, toggle } = useOptimisticToggle({
    data,
    onToggle: (next) => {
      if (next) {
        favorite.mutate({ talkId });
        track('talk_favorited', { talk_id: talkId });
      } else {
        unfavorite.mutate({ talkId });
        track('talk_unfavorited', { talk_id: talkId });
      }
    },
  });

  const favorite = useMutation(api.users.favoriteTalk, {
    onError: clearOptimistic,
  });

  const unfavorite = useMutation(api.users.unfavoriteTalk, {
    onError: clearOptimistic,
  });

  return { isFavorited: isActive, isLoading, toggle };
}
