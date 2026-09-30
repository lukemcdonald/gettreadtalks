'use client';

import type { SpeakerTrackEntity, TalkTrackEntity } from '@/lib/analytics';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import { useMutation, useOptimisticToggle } from '@/hooks';
import { talkTrackProps, track } from '@/lib/analytics';

export function useToggleTalkFeatured({
  speaker,
  talk,
}: {
  speaker?: Pick<SpeakerTrackEntity, 'slug'> | null;
  talk: TalkTrackEntity;
}) {
  const talkId = talk._id;
  const talkDoc = useQuery(api.talks.getTalk, { id: talkId });

  const { clearOptimistic, isActive, isLoading, toggle } = useOptimisticToggle({
    data: talkDoc?.featured,
    onToggle: (next) => {
      update.mutate({ featured: next, talkId });
      track(
        next ? 'talk_featured' : 'talk_unfeatured',
        talkTrackProps(talk, speaker)
      );
    },
  });

  const update = useMutation(api.talks.updateTalk, {
    onError: clearOptimistic,
  });

  return { isFeatured: isActive, isLoading, toggle };
}
