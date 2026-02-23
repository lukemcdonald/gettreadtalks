'use client';

import type { TalkId } from '@/features/talks/types';

import { useState } from 'react';
import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/hooks';
import { useAnalytics } from '@/lib/analytics';

export function useToggleTalkFinished(talkId: TalkId) {
  const data = useQuery(api.users.isTalkFinished, { talkId });
  const [optimisticState, setOptimisticState] = useState<boolean | null>(null);
  const { track } = useAnalytics();

  const clearOptimistic = () => setOptimisticState(null);

  const finish = useMutation(api.users.finishTalk, {
    onError: clearOptimistic,
    onSuccess: clearOptimistic,
  });

  const unfinish = useMutation(api.users.unfinishTalk, {
    onError: clearOptimistic,
    onSuccess: clearOptimistic,
  });

  const isFinished = optimisticState ?? data ?? false;
  const isLoading = data === undefined;

  const toggle = () => {
    setOptimisticState(!isFinished);

    if (isFinished) {
      unfinish.mutate({ talkId });
      track('talk_unfinished', { talk_id: talkId });
    } else {
      finish.mutate({ talkId });
      track('talk_finished', { talk_id: talkId });
    }
  };

  return { isFinished, isLoading, toggle };
}
