'use client';

import type { Id } from '@/convex/_generated/dataModel';

import { HeartMinusIcon } from 'lucide-react';

import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui';
import { api } from '@/convex/_generated/api';
import { useMutation } from '@/hooks';

interface UnfavoriteButtonProps {
  disabled?: boolean;
  onRemove: () => void;
}

function UnfavoriteButton({ disabled, onRemove }: UnfavoriteButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={() => (
          <Button
            disabled={disabled}
            onClick={onRemove}
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

export function UnfavoriteClipButton({ clipId }: { clipId: Id<'clips'> }) {
  const { isLoading, mutate } = useMutation(api.users.unfavoriteClip);
  return <UnfavoriteButton disabled={isLoading} onRemove={() => mutate({ clipId })} />;
}

export function UnfavoriteSpeakerButton({ speakerId }: { speakerId: Id<'speakers'> }) {
  const { isLoading, mutate } = useMutation(api.users.unfavoriteSpeaker);
  return <UnfavoriteButton disabled={isLoading} onRemove={() => mutate({ speakerId })} />;
}

export function UnfavoriteTalkButton({ talkId }: { talkId: Id<'talks'> }) {
  const { isLoading, mutate } = useMutation(api.users.unfavoriteTalk);
  return <UnfavoriteButton disabled={isLoading} onRemove={() => mutate({ talkId })} />;
}
