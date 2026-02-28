'use client';

import type { TalkId } from '@/features/talks/types';

import { Authenticated } from 'convex/react';
import { BookmarkIcon } from 'lucide-react';

import { ToggleIconButton } from '@/components/ui';
import { useToggleTalkFinished } from '@/features/users/hooks/use-toggle-talk-finished';

interface FinishTalkButtonProps {
  talkId: TalkId;
}

function FinishButton({ talkId }: FinishTalkButtonProps) {
  const { isFinished, isLoading, toggle } = useToggleTalkFinished(talkId);

  return (
    <ToggleIconButton
      activeLabel="Mark unfinished"
      disabled={isLoading}
      icon={BookmarkIcon}
      inactiveLabel="Mark finished"
      isActive={isFinished}
      onToggle={toggle}
    />
  );
}

export function FinishTalkButton({ talkId }: FinishTalkButtonProps) {
  return (
    <Authenticated>
      <FinishButton talkId={talkId} />
    </Authenticated>
  );
}
