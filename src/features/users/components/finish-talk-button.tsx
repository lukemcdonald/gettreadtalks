'use client';

import type { TalkId } from '@/features/talks/types';

import { Authenticated } from 'convex/react';
import { DynamicIcon } from 'lucide-react/dynamic';

import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui';
import {
  useFinishTalk,
  useIsTalkFinished,
  useUnfinishTalk,
} from '@/features/users/hooks/use-finish-talk';
import { useAnalytics } from '@/lib/analytics';

interface FinishTalkButtonProps {
  talkId: TalkId;
}

function FinishButton({ talkId }: FinishTalkButtonProps) {
  const { data: isFinished, isLoading: isCheckingFinished } = useIsTalkFinished(talkId);
  const finishTalk = useFinishTalk();
  const unfinishTalk = useUnfinishTalk();
  const { track } = useAnalytics();

  const isProcessing = isCheckingFinished || finishTalk.isLoading || unfinishTalk.isLoading;

  const handleToggleFinish = () => {
    if (isFinished) {
      unfinishTalk.mutate({ talkId });
      track('talk_unfinished', { talk_id: talkId });
    } else {
      finishTalk.mutate({ talkId });
      track('talk_finished', { talk_id: talkId });
    }
  };

  return (
    <Button
      className="justify-start gap-2"
      disabled={isProcessing}
      onClick={handleToggleFinish}
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
