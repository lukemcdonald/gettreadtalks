'use client';

import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { Authenticated } from 'convex/react';
import { HeartIcon } from 'lucide-react';

import { ActionButton } from '@/components/ui';
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
    <ActionButton
      data-testid="favorite-talk"
      icon={HeartIcon}
      label="Favorite"
      loading={isLoading}
      onClick={toggle}
      pressed={isFavorited}
    />
  );
}

export function FavoriteTalkButton({ speaker, talk }: FavoriteTalkButtonProps) {
  return (
    <Authenticated>
      <FavoriteButton speaker={speaker} talk={talk} />
    </Authenticated>
  );
}
