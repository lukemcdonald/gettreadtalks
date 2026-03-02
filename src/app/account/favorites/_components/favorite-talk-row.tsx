'use client';

import type { Id } from '@/convex/_generated/dataModel';

import { TalkTableRow } from '@/features/users/components/talk-table-row';
import { UnfavoriteTalkButton } from '@/features/users/components/unfavorite-buttons';
import { OptimisticRow } from '../../_components/optimistic-row';

interface FavoriteTalkRowProps {
  href: string;
  speaker?: { firstName: string; lastName: string } | null;
  talkId: Id<'talks'>;
  title: string;
}

export function FavoriteTalkRow({ href, speaker, talkId, title }: FavoriteTalkRowProps) {
  return (
    <OptimisticRow>
      {({ onError, onMutate }) => (
        <TalkTableRow
          action={<UnfavoriteTalkButton onError={onError} onMutate={onMutate} talkId={talkId} />}
          href={href}
          speaker={speaker}
          title={title}
        />
      )}
    </OptimisticRow>
  );
}
