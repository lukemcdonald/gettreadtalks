'use client';

import type { TalkId } from '@/features/talks/types';
import type { UseMutationOptions } from '@/hooks/use-mutation';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/hooks';

export function useFinishTalk(options?: UseMutationOptions) {
  return useMutation(api.users.finishTalk, options);
}

export function useUnfinishTalk(options?: UseMutationOptions) {
  return useMutation(api.users.unfinishTalk, options);
}

export function useIsTalkFinished(talkId: TalkId) {
  const data = useQuery(api.users.isTalkFinished, { talkId });

  return {
    data: data ?? false,
    isLoading: data === undefined,
  };
}
