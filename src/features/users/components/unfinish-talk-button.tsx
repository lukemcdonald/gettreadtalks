'use client';

import type { TalkId } from '@/features/talks/types';

import { CircleCheckBigIcon } from 'lucide-react';

import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui';
import { revalidateUserLists } from '@/features/users/actions/revalidate-user-lists';
import { useUnfinishTalk } from '@/features/users/hooks/use-unfinish-talk';

interface UnfinishTalkButtonProps {
  onError?: () => void;
  onMutate?: () => void;
  talkId: TalkId;
}

export function UnfinishTalkButton({
  onError,
  onMutate,
  talkId,
}: UnfinishTalkButtonProps) {
  const { isLoading, mutate } = useUnfinishTalk({
    onError,
    onSuccess: () => {
      void revalidateUserLists({ refreshPage: true });
    },
  });

  const handleRemove = () => {
    if (onMutate) {
      onMutate();
    }
    mutate({ talkId });
  };

  return (
    <Tooltip>
      <TooltipTrigger
        render={() => (
          <Button
            loading={isLoading}
            onClick={handleRemove}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <CircleCheckBigIcon />
          </Button>
        )}
      />
      <TooltipContent>
        <p>Mark as not finished</p>
      </TooltipContent>
    </Tooltip>
  );
}
