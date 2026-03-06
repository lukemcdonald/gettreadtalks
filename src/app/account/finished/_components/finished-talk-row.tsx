'use client';

import type { Speaker } from '@/features/speakers/types';
import type { TalkId } from '@/features/talks/types';

import { TalkTableRow } from '@/features/users/components/talk-table-row';
import { UnfinishTalkButton } from '@/features/users/components/unfinish-talk-button';
import { useOptimisticRow } from '../../_components/use-optimistic-row';

interface FinishedTalkRowProps {
  href: string;
  speaker?: Pick<Speaker, 'firstName' | 'lastName'> | null;
  talkId: TalkId;
  title: string;
}

export function FinishedTalkRow({ href, speaker, talkId, title }: FinishedTalkRowProps) {
  const { onError, onMutate, removed } = useOptimisticRow();

  if (removed) {
    return null;
  }

  return (
    <TalkTableRow
      action={<UnfinishTalkButton onError={onError} onMutate={onMutate} talkId={talkId} />}
      href={href}
      speaker={speaker}
      title={title}
    />
  );
}
