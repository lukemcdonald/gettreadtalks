'use client';

import type { SpeakerId } from '@/features/speakers/types';

import { Authenticated } from 'convex/react';
import { HeartIcon } from 'lucide-react';

import { ToggleIconButton } from '@/components/ui';
import { useToggleSpeakerFavorited } from '@/features/users/hooks/use-toggle-speaker-favorited';

interface FavoriteSpeakerButtonProps {
  speakerId: SpeakerId;
}

function FavoriteButton({ speakerId }: FavoriteSpeakerButtonProps) {
  const { isFavorited, isLoading, toggle } = useToggleSpeakerFavorited(speakerId);

  return (
    <ToggleIconButton
      activeLabel="Unfavorite"
      disabled={isLoading}
      icon={HeartIcon}
      inactiveLabel="Favorite"
      isActive={isFavorited}
      onToggle={toggle}
    />
  );
}

export function FavoriteSpeakerButton({ speakerId }: FavoriteSpeakerButtonProps) {
  return (
    <Authenticated>
      <FavoriteButton speakerId={speakerId} />
    </Authenticated>
  );
}
