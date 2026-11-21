'use client';

import type { TalkId } from '@/features/talks/types';

import { destroyTalkAction } from '@/features/talks/actions/destroy-talk';

export function useDestroyTalk(options?: { onSuccess?: () => void }) {
  async function destroyTalk(talkId: TalkId) {
    const result = await destroyTalkAction(talkId);

    if (result.success) {
      options?.onSuccess?.();
    }

    return result;
  }

  return { destroyTalk };
}
