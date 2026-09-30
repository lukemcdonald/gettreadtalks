'use client';

import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import { useMutation, useOptimisticToggle } from '@/hooks';
import { talkTrackProps, track } from '@/lib/analytics';

export function useToggleTalkFavorited({
  speaker,
  talk,
}: {
  speaker?: Pick<Speaker, '_id' | 'slug'> | null;
  talk: Pick<Talk, '_id' | 'slug'>;
}) {
  const talkId = talk._id;
  const data = useQuery(api.users.isTalkFavorited, { talkId });

  const { clearOptimistic, isActive, isLoading, toggle } = useOptimisticToggle({
    data,
    onToggle: (next) => {
      if (next) {
        favorite.mutate({ talkId });
      } else {
        unfavorite.mutate({ talkId });
      }
    },
  });

  const favorite = useMutation(api.users.favoriteTalk, {
    onError: clearOptimistic,
    onSuccess: () => track('talk_favorited', talkTrackProps(talk, speaker)),
  });

  const unfavorite = useMutation(api.users.unfavoriteTalk, {
    onError: clearOptimistic,
    onSuccess: () => track('talk_unfavorited', talkTrackProps(talk, speaker)),
  });

  return { isFavorited: isActive, isLoading, toggle };
}
