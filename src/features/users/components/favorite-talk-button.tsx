'use client';

import type { TalkId } from '@/features/talks/types';

import { Authenticated } from 'convex/react';
import { DynamicIcon } from 'lucide-react/dynamic';

import { Button } from '@/components/ui';
import { useToggleTalkFavorited } from '@/features/users/hooks/use-toggle-talk-favorited';

interface FavoriteTalkButtonProps {
  talkId: TalkId;
}

function FavoriteButton({ talkId }: FavoriteTalkButtonProps) {
  const { isFavorited, isLoading, toggle } = useToggleTalkFavorited(talkId);

  return (
    <Button
      className="justify-start gap-2"
      disabled={isLoading}
      onClick={toggle}
      type="button"
      variant={isFavorited ? 'secondary' : 'ghost'}
    >
      <DynamicIcon className="size-4" name="heart" />
      {isFavorited ? 'Favorited' : 'Favorite'}
    </Button>
  );
}

export function FavoriteTalkButton({ talkId }: FavoriteTalkButtonProps) {
  return (
    <Authenticated>
      <FavoriteButton talkId={talkId} />
    </Authenticated>
  );
}
