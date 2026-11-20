'use client';

import type { ClipId } from '@/features/clips/types';

import { destroyClipAction } from '@/features/clips/actions/destroy-clip';

export function useDestroyClip(options?: { onSuccess?: () => void }) {
  async function destroyClip(clipId: ClipId) {
    const result = await destroyClipAction(clipId);

    if (result.success) {
      options?.onSuccess?.();
    }

    return result;
  }

  return { destroyClip };
}
