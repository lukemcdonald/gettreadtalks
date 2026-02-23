'use client';

import type { TalkId } from '@/features/talks/types';

import { Authenticated } from 'convex/react';
import { HeartIcon } from 'lucide-react';

import { ActionIconButton } from '@/components/ui';
import { useToggleTalkFavorited } from '@/features/users/hooks/use-toggle-talk-favorited';

interface FavoriteTalkButtonProps {
  talkId: TalkId;
}

function FavoriteButton({ talkId }: FavoriteTalkButtonProps) {
  const { isFavorited, isLoading, toggle } = useToggleTalkFavorited(talkId);

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

export function FavoriteTalkButton({ talkId }: FavoriteTalkButtonProps) {
  return (
    <Authenticated>
      <FavoriteButton talkId={talkId} />
    </Authenticated>
  );
}
