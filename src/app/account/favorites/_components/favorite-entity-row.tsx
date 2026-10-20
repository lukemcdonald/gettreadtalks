'use client';

import type { ClipId } from '@/features/clips/types';
import type { Speaker, SpeakerId } from '@/features/speakers/types';

import { TalkTableRow } from '@/features/users/components/talk-table-row';
import {
  UnfavoriteClipButton,
  UnfavoriteSpeakerButton,
} from '@/features/users/components/unfavorite-buttons';
import { useOptimisticRow } from '@/hooks/use-optimistic-row';

import { EntityTableRow } from './entity-table-row';

interface FavoriteSpeakerRowProps {
  href: string;
  speakerId: SpeakerId;
  title: string;
}

export function FavoriteSpeakerRow({
  href,
  speakerId,
  title,
}: FavoriteSpeakerRowProps) {
  const { onError, onMutate, removed } = useOptimisticRow();

  if (removed) {
    return null;
  }

  return (
    <EntityTableRow
      action={
        <UnfavoriteSpeakerButton
          onError={onError}
          onMutate={onMutate}
          speakerId={speakerId}
        />
      }
      href={href}
      title={title}
    />
  );
}

interface FavoriteClipRowProps {
  clipId: ClipId;
  href: string;
  scripture?: string;
  speaker?: Pick<Speaker, 'firstName' | 'lastName'> | null;
  title: string;
}

export function FavoriteClipRow({
  clipId,
  href,
  scripture,
  speaker,
  title,
}: FavoriteClipRowProps) {
  const { onError, onMutate, removed } = useOptimisticRow();

  if (removed) {
    return null;
  }

  return (
    <TalkTableRow
      action={
        <UnfavoriteClipButton
          clipId={clipId}
          onError={onError}
          onMutate={onMutate}
        />
      }
      href={href}
      scripture={scripture}
      speaker={speaker}
      title={title}
    />
  );
}
