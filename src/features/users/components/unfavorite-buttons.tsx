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

interface OptimisticCallbacks {
  onError?: () => void;
  onMutate?: () => void;
}

export function UnfavoriteClipButton({
  clipId,
  onError,
  onMutate,
}: { clipId: Id<'clips'> } & OptimisticCallbacks) {
  const { isLoading, mutate } = useMutation(api.users.unfavoriteClip, { onError });

  const handleRemove = () => {
    if (onMutate) {
      onMutate();
    }
    mutate({ clipId });
  };

  return <UnfavoriteButton disabled={isLoading} onRemove={handleRemove} />;
}

export function UnfavoriteSpeakerButton({
  onError,
  onMutate,
  speakerId,
}: { speakerId: Id<'speakers'> } & OptimisticCallbacks) {
  const { isLoading, mutate } = useMutation(api.users.unfavoriteSpeaker, { onError });

  const handleRemove = () => {
    if (onMutate) {
      onMutate();
    }
    mutate({ speakerId });
  };

  return <UnfavoriteButton disabled={isLoading} onRemove={handleRemove} />;
}

export function UnfavoriteTalkButton({
  onError,
  onMutate,
  talkId,
}: { talkId: Id<'talks'> } & OptimisticCallbacks) {
  const { isLoading, mutate } = useMutation(api.users.unfavoriteTalk, { onError });

  const handleRemove = () => {
    if (onMutate) {
      onMutate();
    }
    mutate({ talkId });
  };

  return <UnfavoriteButton disabled={isLoading} onRemove={handleRemove} />;
}
