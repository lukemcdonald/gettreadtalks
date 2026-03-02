'use client';

import type { Id } from '@/convex/_generated/dataModel';

import { TalkTableRow } from '@/features/users/components/talk-table-row';
import { UnfinishTalkButton } from '@/features/users/components/unfinish-talk-button';
import { OptimisticRow } from '../../_components/optimistic-row';

interface FinishedTalkRowProps {
  href: string;
  speaker?: { firstName: string; lastName: string } | null;
  talkId: Id<'talks'>;
  title: string;
}

export function FinishedTalkRow({ href, speaker, talkId, title }: FinishedTalkRowProps) {
  return (
    <OptimisticRow>
      {({ onError, onMutate }) => (
        <TalkTableRow
          action={<UnfinishTalkButton onError={onError} onMutate={onMutate} talkId={talkId} />}
          href={href}
          speaker={speaker}
          title={title}
        />
      )}
    </OptimisticRow>
  );
}
