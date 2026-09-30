'use client';

import type { TalkId } from '@/features/talks/types';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import { useMutation, useOptimisticToggle } from '@/hooks';
import { talkTrackProps, track } from '@/lib/analytics';

export function useToggleTalkFeatured({
  speaker,
  talk,
}: {
  speaker?: { slug: string } | null;
  talk: { _id: TalkId; slug: string };
}) {
  const talkId = talk._id;
  const talkDoc = useQuery(api.talks.getTalk, { id: talkId });

  const { clearOptimistic, isActive, isLoading, toggle } = useOptimisticToggle({
    data: talkDoc?.featured,
    onToggle: (next) => {
      update.mutate({ featured: next, talkId });
      track(
        next ? 'talk_featured' : 'talk_unfeatured',
        talkTrackProps(talk, speaker?.slug ?? '')
      );
    },
  });

  const update = useMutation(api.talks.updateTalk, {
    onError: clearOptimistic,
  });

  return { isFeatured: isActive, isLoading, toggle };
}
