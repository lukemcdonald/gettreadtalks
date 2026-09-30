'use client';

import type { SpeakerTrackEntity, TalkTrackEntity } from '@/lib/analytics';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import { useMutation, useOptimisticToggle } from '@/hooks';
import { talkTrackProps, track } from '@/lib/analytics';

export function useToggleTalkFavorited({
  speaker,
  talk,
}: {
  speaker?: Pick<SpeakerTrackEntity, 'slug'> | null;
  talk: TalkTrackEntity;
}) {
  const talkId = talk._id;
  const data = useQuery(api.users.isTalkFavorited, { talkId });

  const { clearOptimistic, isActive, isLoading, toggle } = useOptimisticToggle({
    data,
    onToggle: (next) => {
      const properties = talkTrackProps(talk, speaker);

      if (next) {
        favorite.mutate({ talkId });
        track('talk_favorited', properties);
      } else {
        unfavorite.mutate({ talkId });
        track('talk_unfavorited', properties);
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
