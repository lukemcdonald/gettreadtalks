'use client';

import type { SpeakerId } from '@/features/speakers/types';

import { Authenticated } from 'convex/react';
import { HeartIcon } from 'lucide-react';

import { ActionIconButton } from '@/components/ui';
import { useToggleSpeakerFavorited } from '@/features/users/hooks/use-toggle-speaker-favorited';

interface FavoriteSpeakerButtonProps {
  speakerId: SpeakerId;
}

function FavoriteButton({ speakerId }: FavoriteSpeakerButtonProps) {
  const { isFavorited, isLoading, toggle } = useToggleSpeakerFavorited(speakerId);

  return (
    <ActionIconButton
      disabled={isLoading}
      label={isFavorited ? 'Unfavorite' : 'Favorite'}
      onClick={toggle}
    >
      <HeartIcon strokeWidth={2.5} />
    </ActionIconButton>
  );
}

export function FavoriteSpeakerButton({ speakerId }: FavoriteSpeakerButtonProps) {
  return (
    <Authenticated>
      <FavoriteButton speakerId={speakerId} />
    </Authenticated>
  );
}
