'use client';

import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { HeartIcon } from 'lucide-react';

import { ToggleIconButton } from '@/components/ui';
import { useCurrentUser } from '@/features/users/hooks/use-current-user';
import { useToggleTalkFavorited } from '@/features/users/hooks/use-toggle-talk-favorited';

interface FavoriteTalkButtonProps {
  speaker?: Pick<Speaker, '_id' | 'slug'> | null;
  talk: Pick<Talk, '_id' | 'slug'>;
}

function FavoriteButton({ speaker, talk }: FavoriteTalkButtonProps) {
  const { isFavorited, isLoading, toggle } = useToggleTalkFavorited({
    speaker,
    talk,
  });

  return (
    <ToggleIconButton
      activeLabel="Unfavorite"
      data-testid="favorite-talk"
      icon={HeartIcon}
      inactiveLabel="Favorite"
      isActive={isFavorited}
      loading={isLoading}
      onToggle={toggle}
    />
  );
}

export function FavoriteTalkButton({ speaker, talk }: FavoriteTalkButtonProps) {
  const { data: user } = useCurrentUser();

  if (!user) {
    return null;
  }

  return <FavoriteButton speaker={speaker} talk={talk} />;
}
