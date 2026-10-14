'use client';

import type { OptimisticCallbacks } from './types';
import type { TalkId } from '@/features/talks/types';

import { revalidateUserLists } from '@/features/users/actions/revalidate-user-lists';
import { useUnfavoriteTalk } from '@/features/users/hooks/use-unfavorite-talk';

import { UnfavoriteButton } from './unfavorite-button';

interface UnfavoriteTalkButtonProps extends OptimisticCallbacks {
  talkId: TalkId;
}

export function UnfavoriteTalkButton({
  onError,
  onMutate,
  talkId,
}: UnfavoriteTalkButtonProps) {
  const { isLoading, mutate } = useUnfavoriteTalk({
    onError,
    onSuccess: () => {
      void revalidateUserLists({ refreshPage: true });
    },
  });

  const handleRemove = () => {
    if (onMutate) {
      onMutate();
    }
    mutate({ talkId });
  };

  return <UnfavoriteButton loading={isLoading} onRemove={handleRemove} />;
}
