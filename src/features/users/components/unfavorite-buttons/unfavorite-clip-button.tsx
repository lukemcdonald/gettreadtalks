'use client';

import type { OptimisticCallbacks } from './types';
import type { ClipId } from '@/features/clips/types';

import { revalidateUserLists } from '@/features/users/actions/revalidate-user-lists';
import { useUnfavoriteClip } from '@/features/users/hooks/use-unfavorite-clip';

import { UnfavoriteButton } from './unfavorite-button';

interface UnfavoriteClipButtonProps extends OptimisticCallbacks {
  clipId: ClipId;
}

export function UnfavoriteClipButton({
  clipId,
  onError,
  onMutate,
}: UnfavoriteClipButtonProps) {
  const { isLoading, mutate } = useUnfavoriteClip({
    onError,
    onSuccess: () => {
      void revalidateUserLists({ refreshPage: true });
    },
  });

  const handleRemove = () => {
    if (onMutate) {
      onMutate();
    }
    mutate({ clipId });
  };

  return <UnfavoriteButton loading={isLoading} onRemove={handleRemove} />;
}
