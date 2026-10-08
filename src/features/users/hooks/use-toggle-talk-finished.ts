'use client';

import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import { revalidateUserLists } from '@/features/users/actions/revalidate-user-lists';
import { useMutation, useOptimisticToggle } from '@/hooks';
import { talkTrackProps, track } from '@/services/analytics';

export function useToggleTalkFinished({
  speaker,
  talk,
}: {
  speaker?: Pick<Speaker, '_id' | 'slug'> | null;
  talk: Pick<Talk, '_id' | 'slug'>;
}) {
  const talkId = talk._id;
  const data = useQuery(api.users.isTalkFinished, { talkId });

  const { clearOptimistic, isActive, isLoading, toggle } = useOptimisticToggle({
    data,
    onToggle: (next) => {
      if (next) {
        finish.mutate({ talkId });
      } else {
        unfinish.mutate({ talkId });
      }
    },
  });

  const finish = useMutation(api.users.finishTalk, {
    onError: clearOptimistic,
    onSuccess: () => {
      void revalidateUserLists();
      track('talk_finished', talkTrackProps(talk, speaker));
    },
  });

  const unfinish = useMutation(api.users.unfinishTalk, {
    onError: clearOptimistic,
    onSuccess: () => {
      void revalidateUserLists();
      track('talk_unfinished', talkTrackProps(talk, speaker));
    },
  });

  return { isFinished: isActive, isLoading, toggle };
}
