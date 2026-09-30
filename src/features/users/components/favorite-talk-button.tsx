'use client';

import type { TalkId } from '@/features/talks/types';

import { Authenticated } from 'convex/react';
import { HeartIcon } from 'lucide-react';

import { ToggleIconButton } from '@/components/ui';
import { useToggleTalkFavorited } from '@/features/users/hooks/use-toggle-talk-favorited';

interface FavoriteTalkButtonProps {
  speaker?: { slug: string } | null;
  talk: { _id: TalkId; slug: string };
}

function FavoriteButton({ speaker, talk }: FavoriteTalkButtonProps) {
  const { isFavorited, isLoading, toggle } = useToggleTalkFavorited({
    speaker,
    talk,
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

export function FavoriteTalkButton({ speaker, talk }: FavoriteTalkButtonProps) {
  return (
    <Authenticated>
      <FavoriteButton speaker={speaker} talk={talk} />
    </Authenticated>
  );
}
