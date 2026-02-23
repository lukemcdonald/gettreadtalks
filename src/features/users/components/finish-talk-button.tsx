'use client';

import type { TalkId } from '@/features/talks/types';

import { Authenticated } from 'convex/react';
import { DynamicIcon } from 'lucide-react/dynamic';

import { Button } from '@/components/ui';
import { useToggleTalkFinished } from '@/features/users/hooks/use-toggle-talk-finished';

interface FinishTalkButtonProps {
  talkId: TalkId;
}

function FinishButton({ talkId }: FinishTalkButtonProps) {
  const { isFinished, isLoading, toggle } = useToggleTalkFinished(talkId);

  return (
    <Button
      className="justify-start gap-2"
      disabled={isLoading}
      onClick={toggle}
      type="button"
      variant={isFinished ? 'secondary' : 'ghost'}
    >
      <DynamicIcon className="size-4" name={isFinished ? 'circle-check-big' : 'circle-check'} />
      {isFinished ? 'Finished' : 'Mark Finished'}
    </Button>
  );
}

export function FinishTalkButton({ talkId }: FinishTalkButtonProps) {
  return (
    <Authenticated>
      <FinishButton talkId={talkId} />
    </Authenticated>
  );
}
