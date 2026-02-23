'use client';

import type { TalkId } from '@/features/talks/types';

import { Authenticated } from 'convex/react';
import { DynamicIcon } from 'lucide-react/dynamic';

import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui';
import { useFavoriteTalk } from '@/features/users/hooks/use-favorite-talk';
import { useIsTalkFavorited } from '@/features/users/hooks/use-is-talk-favorited';
import { useUnfavoriteTalk } from '@/features/users/hooks/use-unfavorite-talk';
import { useAnalytics } from '@/lib/analytics';

interface FavoriteTalkButtonProps {
  talkId: TalkId;
}

function FavoriteButton({ talkId }: FavoriteTalkButtonProps) {
  const { data: isFavorited, isLoading: isCheckingFavorite } = useIsTalkFavorited(talkId);
  const favoriteTalk = useFavoriteTalk();
  const unfavoriteTalk = useUnfavoriteTalk();
  const { track } = useAnalytics();

  const isProcessing = isCheckingFavorite || favoriteTalk.isLoading || unfavoriteTalk.isLoading;

  const handleToggleFavorite = () => {
    if (isFavorited) {
      unfavoriteTalk.mutate({ talkId });
      track('talk_unfavorited', { talk_id: talkId });
    } else {
      favoriteTalk.mutate({ talkId });
      track('talk_favorited', { talk_id: talkId });
    }
  };

  return (
    <Button
      className="justify-start gap-2"
      disabled={isProcessing}
      onClick={handleToggleFavorite}
      type="button"
      variant={isFavorited ? 'secondary' : 'ghost'}
    >
      <DynamicIcon className="size-4" name={isFavorited ? 'heart' : 'heart'} />
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
