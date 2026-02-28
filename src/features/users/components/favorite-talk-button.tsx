'use client';

import type { TalkId } from '@/features/talks/types';

import { Authenticated } from 'convex/react';
import { HeartIcon } from 'lucide-react';

import { ToggleIconButton } from '@/components/ui';
import { useToggleTalkFavorited } from '@/features/users/hooks/use-toggle-talk-favorited';

interface FavoriteTalkButtonProps {
  talkId: TalkId;
}

function FavoriteButton({ talkId }: FavoriteTalkButtonProps) {
  const { isFavorited, isLoading, toggle } = useToggleTalkFavorited(talkId);

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

export function FavoriteTalkButton({ talkId }: FavoriteTalkButtonProps) {
  return (
    <Authenticated>
      <FavoriteButton talkId={talkId} />
    </Authenticated>
  );
}
