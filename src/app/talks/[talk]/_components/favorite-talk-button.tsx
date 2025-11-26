'use client';

import type { TalkId } from '@/features/talks';

import { Authenticated } from 'convex/react';
import { DynamicIcon } from 'lucide-react/dynamic';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useFavoriteTalk, useIsTalkFavorited, useUnfavoriteTalk } from '@/features/users/hooks';

type FavoriteTalkButtonProps = {
  talkId: TalkId;
};

function FavoriteButton({ talkId }: FavoriteTalkButtonProps) {
  const { data: isFavorited, isLoading: isCheckingFavorite } = useIsTalkFavorited(talkId);
  const favoriteTalk = useFavoriteTalk();
  const unfavoriteTalk = useUnfavoriteTalk();

  const isProcessing = isCheckingFavorite || favoriteTalk.isLoading || unfavoriteTalk.isLoading;

  const handleToggleFavorite = () => {
    if (isFavorited) {
      unfavoriteTalk.mutate({ talkId });
    } else {
      favoriteTalk.mutate({ talkId });
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger
        render={() => (
          <Button
            disabled={isProcessing}
            onClick={handleToggleFavorite}
            type="button"
            variant={isFavorited ? 'destructive' : 'default'}
          >
            <DynamicIcon name={isFavorited ? 'heart-minus' : 'heart-plus'} />
          </Button>
        )}
      />

      <TooltipContent>
        <p>{isFavorited ? 'Remove from favorites' : 'Add to favorites'}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export function FavoriteTalkButton({ talkId }: FavoriteTalkButtonProps) {
  return (
    <Authenticated>
      <FavoriteButton talkId={talkId} />
    </Authenticated>
  );
}
