'use client';

import type { TalkId } from '@/features/talks/types';

import { Authenticated } from 'convex/react';
import { CircleCheckIcon } from 'lucide-react';

import { ActionIconButton } from '@/components/ui';
import { useToggleTalkFinished } from '@/features/users/hooks/use-toggle-talk-finished';

interface FinishTalkButtonProps {
  talkId: TalkId;
}

function FinishButton({ talkId }: FinishTalkButtonProps) {
  const { isFinished, isLoading, toggle } = useToggleTalkFinished(talkId);

  return (
    <ActionIconButton
      disabled={isLoading}
      label={isFinished ? 'Mark unfinished' : 'Mark finished'}
      onClick={toggle}
    >
      <CircleCheckIcon strokeWidth={2.5} />
    </ActionIconButton>
  );
}

export function FinishTalkButton({ talkId }: FinishTalkButtonProps) {
  return (
    <Authenticated>
      <FinishButton talkId={talkId} />
    </Authenticated>
  );
}
