'use client';

import type { Id } from '@/convex/_generated/dataModel';

import { Authenticated } from 'convex/react';
import { DynamicIcon } from 'lucide-react/dynamic';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useFavoriteTalk, useIsTalkFavorited, useUnfavoriteTalk } from '@/lib/features/users/hooks';

interface FavoriteTalkButtonProps {
  talkId: Id<'talks'>;
}

function FavoriteButton({ talkId }: FavoriteTalkButtonProps) {
  const { data: isFavorited, isLoading: isCheckingFavorite } = useIsTalkFavorited(talkId);
  const { mutate: favoriteTalk, isLoading: isFavoriting } = useFavoriteTalk();
  const { mutate: unfavoriteTalk, isLoading: isUnfavoriting } = useUnfavoriteTalk();

  const isProcessing = isCheckingFavorite || isFavoriting || isUnfavoriting;

  const handleToggleFavorite = async () => {
    if (isFavorited) {
      await unfavoriteTalk({ talkId });
    } else {
      await favoriteTalk({ talkId });
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
