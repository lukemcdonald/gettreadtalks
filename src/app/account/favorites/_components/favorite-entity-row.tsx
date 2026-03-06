'use client';

import type { ClipId } from '@/features/clips/types';
import type { SpeakerId } from '@/features/speakers/types';

import {
  UnfavoriteClipButton,
  UnfavoriteSpeakerButton,
} from '@/features/users/components/unfavorite-buttons';
import { useOptimisticRow } from '../../_components/use-optimistic-row';
import { EntityTableRow } from './entity-table-row';

interface FavoriteSpeakerRowProps {
  href: string;
  speakerId: SpeakerId;
  title: string;
}

export function FavoriteSpeakerRow({ href, speakerId, title }: FavoriteSpeakerRowProps) {
  const { onError, onMutate, removed } = useOptimisticRow();

  if (removed) {
    return null;
  }

  return (
    <EntityTableRow
      action={
        <UnfavoriteSpeakerButton onError={onError} onMutate={onMutate} speakerId={speakerId} />
      }
      href={href}
      title={title}
    />
  );
}

interface FavoriteClipRowProps {
  clipId: ClipId;
  href: string;
  title: string;
}

export function FavoriteClipRow({ clipId, href, title }: FavoriteClipRowProps) {
  const { onError, onMutate, removed } = useOptimisticRow();

  if (removed) {
    return null;
  }

  return (
    <EntityTableRow
      action={<UnfavoriteClipButton clipId={clipId} onError={onError} onMutate={onMutate} />}
      href={href}
      title={title}
    />
  );
}
