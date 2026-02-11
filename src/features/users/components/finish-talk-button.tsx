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

interface FinishTalkButtonProps {
  talkId: TalkId;
}

function FinishButton({ talkId }: FinishTalkButtonProps) {
  const { data: isFinished, isLoading: isCheckingFinished } = useIsTalkFinished(talkId);
  const finishTalk = useFinishTalk();
  const unfinishTalk = useUnfinishTalk();

  const isProcessing = isCheckingFinished || finishTalk.isLoading || unfinishTalk.isLoading;

  const handleToggleFinish = () => {
    if (isFinished) {
      unfinishTalk.mutate({ talkId });
    } else {
      finishTalk.mutate({ talkId });
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger
        render={() => (
          <Button
            className="rounded-full"
            disabled={isProcessing}
            onClick={handleToggleFinish}
            size="icon"
            type="button"
            variant={isFinished ? 'secondary' : 'default'}
          >
            <DynamicIcon name={isFinished ? 'circle-check-big' : 'circle-check'} />
          </Button>
        )}
      />

      <TooltipContent>
        <p>{isFinished ? 'Mark as not finished' : 'Mark as finished'}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export function FinishTalkButton({ talkId }: FinishTalkButtonProps) {
  return (
    <Authenticated>
      <FinishButton talkId={talkId} />
    </Authenticated>
  );
}
