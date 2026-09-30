'use client';

import type { SpeakerTrackEntity } from '@/lib/analytics';

import { Authenticated } from 'convex/react';
import { HeartIcon } from 'lucide-react';

import { ToggleIconButton } from '@/components/ui';
import { useToggleSpeakerFavorited } from '@/features/users/hooks/use-toggle-speaker-favorited';

interface FavoriteSpeakerButtonProps {
  speaker: SpeakerTrackEntity;
}

function FavoriteButton({ speaker }: FavoriteSpeakerButtonProps) {
  const { isFavorited, isLoading, toggle } = useToggleSpeakerFavorited({
    speaker,
  });

  return (
    <ToggleIconButton
      activeLabel="Unfavorite"
      icon={HeartIcon}
      inactiveLabel="Favorite"
      isActive={isFavorited}
      loading={isLoading}
      onToggle={toggle}
    />
  );
}

export function FavoriteSpeakerButton({ speaker }: FavoriteSpeakerButtonProps) {
  return (
    <Authenticated>
      <FavoriteButton speaker={speaker} />
    </Authenticated>
  );
}
