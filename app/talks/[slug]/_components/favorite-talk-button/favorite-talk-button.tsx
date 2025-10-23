'use client';

import type { Id } from '@/convex/_generated/dataModel';

import { useFavoriteTalk, useIsTalkFavorited, useUnfavoriteTalk } from '@/lib/features/users/hooks';

interface FavoriteTalkButtonProps {
  talkId: Id<'talks'>;
}

export function FavoriteTalkButton({ talkId }: FavoriteTalkButtonProps) {
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
    <button
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={isProcessing}
      onClick={handleToggleFavorite}
      type="button"
    >
      <span className="text-xl">{isFavorited ? '❤️' : '🤍'}</span>
      <span>{isProcessing ? 'Processing...' : isFavorited ? 'Favorited' : 'Favorite'}</span>
    </button>
  );
}
