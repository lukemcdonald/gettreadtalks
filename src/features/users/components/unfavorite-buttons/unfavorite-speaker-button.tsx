'use client';

import type { OptimisticCallbacks } from './types';
import type { SpeakerId } from '@/features/speakers/types';

import { revalidateUserLists } from '@/features/users/actions/revalidate-user-lists';
import { useUnfavoriteSpeaker } from '@/features/users/hooks/use-unfavorite-speaker';

import { UnfavoriteButton } from './unfavorite-button';

interface UnfavoriteSpeakerButtonProps extends OptimisticCallbacks {
  speakerId: SpeakerId;
}

export function UnfavoriteSpeakerButton({
  onError,
  onMutate,
  speakerId,
}: UnfavoriteSpeakerButtonProps) {
  const { isLoading, mutate } = useUnfavoriteSpeaker({
    onError,
    onSuccess: () => {
      void revalidateUserLists({ refreshPage: true });
    },
  });

  const handleRemove = () => {
    if (onMutate) {
      onMutate();
    }
    mutate({ speakerId });
  };

  return <UnfavoriteButton loading={isLoading} onRemove={handleRemove} />;
}
