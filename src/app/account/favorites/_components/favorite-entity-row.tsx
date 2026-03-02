'use client';

import type { Id } from '@/convex/_generated/dataModel';

import {
  UnfavoriteClipButton,
  UnfavoriteSpeakerButton,
} from '@/features/users/components/unfavorite-buttons';
import { OptimisticRow } from '../../_components/optimistic-row';
import { EntityTableRow } from './entity-table-row';

interface FavoriteSpeakerRowProps {
  href: string;
  speakerId: Id<'speakers'>;
  title: string;
}

export function FavoriteSpeakerRow({ href, speakerId, title }: FavoriteSpeakerRowProps) {
  return (
    <OptimisticRow>
      {({ onError, onMutate }) => (
        <EntityTableRow
          action={
            <UnfavoriteSpeakerButton onError={onError} onMutate={onMutate} speakerId={speakerId} />
          }
          href={href}
          title={title}
        />
      )}
    </OptimisticRow>
  );
}

interface FavoriteClipRowProps {
  clipId: Id<'clips'>;
  href: string;
  title: string;
}

export function FavoriteClipRow({ clipId, href, title }: FavoriteClipRowProps) {
  return (
    <OptimisticRow>
      {({ onError, onMutate }) => (
        <EntityTableRow
          action={<UnfavoriteClipButton clipId={clipId} onError={onError} onMutate={onMutate} />}
          href={href}
          title={title}
        />
      )}
    </OptimisticRow>
  );
}
