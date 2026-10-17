'use client';

import type { Speaker } from '@/features/speakers/types';
import type { TalkId } from '@/features/talks/types';

import { useOptimisticRow } from '@/app/account/_components/use-optimistic-row';
import { TalkTableRow } from '@/features/users/components/talk-table-row';
import { UnfavoriteTalkButton } from '@/features/users/components/unfavorite-buttons';

interface FavoriteTalkRowProps {
  href: string;
  speaker?: Pick<Speaker, 'firstName' | 'lastName'> | null;
  talkId: TalkId;
  title: string;
}

export function FavoriteTalkRow({
  href,
  speaker,
  talkId,
  title,
}: FavoriteTalkRowProps) {
  const { onError, onMutate, removed } = useOptimisticRow();

  if (removed) {
    return null;
  }

  return (
    <TalkTableRow
      action={
        <UnfavoriteTalkButton
          onError={onError}
          onMutate={onMutate}
          talkId={talkId}
        />
      }
      href={href}
      speaker={speaker}
      title={title}
    />
  );
}
