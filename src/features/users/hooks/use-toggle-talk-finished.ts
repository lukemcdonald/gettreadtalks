'use client';

import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import { useMutation, useOptimisticToggle } from '@/hooks';
import { talkTrackProps, track } from '@/lib/analytics';

export function useToggleTalkFinished({
  speaker,
  talk,
}: {
  speaker?: Pick<Speaker, 'slug'> | null;
  talk: Pick<Talk, '_id' | 'slug'>;
}) {
  const talkId = talk._id;
  const data = useQuery(api.users.isTalkFinished, { talkId });

  const { clearOptimistic, isActive, isLoading, toggle } = useOptimisticToggle({
    data,
    onToggle: (next) => {
      const properties = talkTrackProps(talk, speaker);

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
