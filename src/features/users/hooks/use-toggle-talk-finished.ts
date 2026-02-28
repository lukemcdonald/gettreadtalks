'use client';

import type { TalkId } from '@/features/talks/types';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import { useMutation, useOptimisticToggle } from '@/hooks';
import { useAnalytics } from '@/lib/analytics';

export function useToggleTalkFinished(talkId: TalkId) {
  const data = useQuery(api.users.isTalkFinished, { talkId });
  const { track } = useAnalytics();

  const { clearOptimistic, isActive, isLoading, toggle } = useOptimisticToggle({
    data,
    onToggle: (next) => {
      if (next) {
        finish.mutate({ talkId });
        track('talk_finished', { talk_id: talkId });
      } else {
        unfinish.mutate({ talkId });
        track('talk_unfinished', { talk_id: talkId });
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
