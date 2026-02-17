'use client';

import type { Id } from '@/convex/_generated/dataModel';

import { HeartMinusIcon } from 'lucide-react';

import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui';
import { api } from '@/convex/_generated/api';
import { useMutation } from '@/hooks';

interface UnfavoriteTalkButtonProps {
  talkId: Id<'talks'>;
}

export function UnfavoriteTalkButton({ talkId }: UnfavoriteTalkButtonProps) {
  const { isLoading, mutate } = useMutation(api.users.unfavoriteTalk);

  return (
    <Tooltip>
      <TooltipTrigger
        render={() => (
          <Button
            disabled={isLoading}
            onClick={() => mutate({ talkId })}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <HeartMinusIcon />
          </Button>
        )}
      />
      <TooltipContent>
        <p>Remove from favorites</p>
      </TooltipContent>
    </Tooltip>
  );
}

interface UnfavoriteSpeakerButtonProps {
  speakerId: Id<'speakers'>;
}

export function UnfavoriteSpeakerButton({ speakerId }: UnfavoriteSpeakerButtonProps) {
  const { isLoading, mutate } = useMutation(api.users.unfavoriteSpeaker);

  return (
    <Tooltip>
      <TooltipTrigger
        render={() => (
          <Button
            disabled={isLoading}
            onClick={() => mutate({ speakerId })}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <HeartMinusIcon />
          </Button>
        )}
      />
      <TooltipContent>
        <p>Remove from favorites</p>
      </TooltipContent>
    </Tooltip>
  );
}

interface UnfavoriteClipButtonProps {
  clipId: Id<'clips'>;
}

export function UnfavoriteClipButton({ clipId }: UnfavoriteClipButtonProps) {
  const { isLoading, mutate } = useMutation(api.users.unfavoriteClip);

  return (
    <Tooltip>
      <TooltipTrigger
        render={() => (
          <Button
            disabled={isLoading}
            onClick={() => mutate({ clipId })}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <HeartMinusIcon />
          </Button>
        )}
      />
      <TooltipContent>
        <p>Remove from favorites</p>
      </TooltipContent>
    </Tooltip>
  );
}
