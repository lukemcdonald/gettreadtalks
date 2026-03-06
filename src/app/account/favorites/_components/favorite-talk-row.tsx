'use client';

import type { Speaker } from '@/features/speakers/types';
import type { TalkId } from '@/features/talks/types';

import { TalkTableRow } from '@/features/users/components/talk-table-row';
import { UnfavoriteTalkButton } from '@/features/users/components/unfavorite-buttons';
import { useOptimisticRow } from '../../_components/use-optimistic-row';

interface FavoriteTalkRowProps {
  href: string;
  speaker?: Pick<Speaker, 'firstName' | 'lastName'> | null;
  talkId: TalkId;
  title: string;
}

export function FavoriteTalkRow({ href, speaker, talkId, title }: FavoriteTalkRowProps) {
  const { onError, onMutate, removed } = useOptimisticRow();

  if (removed) {
    return null;
  }

  return (
    <TalkTableRow
      action={<UnfavoriteTalkButton onError={onError} onMutate={onMutate} talkId={talkId} />}
      href={href}
      speaker={speaker}
      title={title}
    />
  );
}
