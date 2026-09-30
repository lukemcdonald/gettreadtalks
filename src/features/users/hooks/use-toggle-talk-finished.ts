'use client';

import type { TalkId } from '@/features/talks/types';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import { useMutation, useOptimisticToggle } from '@/hooks';
import { talkTrackProps, track } from '@/lib/analytics';

export function useToggleTalkFinished({
  speaker,
  talk,
}: {
  speaker?: { slug: string } | null;
  talk: { _id: TalkId; slug: string };
}) {
  const talkId = talk._id;
  const data = useQuery(api.users.isTalkFinished, { talkId });

  const { clearOptimistic, isActive, isLoading, toggle } = useOptimisticToggle({
    data,
    onToggle: (next) => {
      const properties = talkTrackProps(talk, speaker?.slug ?? '');

      if (next) {
        finish.mutate({ talkId });
        track('talk_finished', properties);
      } else {
        unfinish.mutate({ talkId });
        track('talk_unfinished', properties);
      }
    },
  });

  const finish = useMutation(api.users.finishTalk, {
    onError: clearOptimistic,
  });

  const unfinish = useMutation(api.users.unfinishTalk, {
    onError: clearOptimistic,
  });

  return { isFinished: isActive, isLoading, toggle };
}
