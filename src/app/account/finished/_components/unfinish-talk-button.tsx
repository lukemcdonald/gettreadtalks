'use client';

import type { Id } from '@/convex/_generated/dataModel';

import { CircleCheckBigIcon } from 'lucide-react';

import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui';
import { api } from '@/convex/_generated/api';
import { useMutation } from '@/hooks';

interface UnfinishTalkButtonProps {
  onError?: () => void;
  onMutate?: () => void;
  talkId: Id<'talks'>;
}

export function UnfinishTalkButton({ onError, onMutate, talkId }: UnfinishTalkButtonProps) {
  const { isLoading, mutate } = useMutation(api.users.unfinishTalk, { onError });

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
            disabled={isLoading}
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
