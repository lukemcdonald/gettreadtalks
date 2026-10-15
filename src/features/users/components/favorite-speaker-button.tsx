'use client';

import type { Speaker } from '@/features/speakers/types';

import { HeartIcon } from 'lucide-react';

import { ToggleIconButton } from '@/components/ui';
import { useCurrentUser } from '@/features/users/hooks/use-current-user';
import { useToggleSpeakerFavorited } from '@/features/users/hooks/use-toggle-speaker-favorited';

interface FavoriteSpeakerButtonProps {
  speaker: Pick<Speaker, '_id' | 'slug'>;
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
  const { data: user } = useCurrentUser();

  if (!user) {
    return null;
  }

  return <FavoriteButton speaker={speaker} />;
}
