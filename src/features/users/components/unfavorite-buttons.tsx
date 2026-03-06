'use client';

import type { Id } from '@/convex/_generated/dataModel';
import type { ClipId } from '@/features/clips/types';
import type { SpeakerId } from '@/features/speakers/types';
import type { TalkId } from '@/features/talks/types';

import { HeartMinusIcon } from 'lucide-react';

import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui';
import { api } from '@/convex/_generated/api';
import { useMutation } from '@/hooks';

interface OptimisticCallbacks {
  onError?: () => void;
  onMutate?: () => void;
}

interface UnfavoriteButtonProps {
  disabled?: boolean;
  onRemove: () => void;
}

interface UnfavoriteClipButtonProps extends OptimisticCallbacks {
  clipId: ClipId;
}

interface UnfavoriteSpeakerButtonProps extends OptimisticCallbacks {
  speakerId: SpeakerId;
}

interface UnfavoriteTalkButtonProps extends OptimisticCallbacks {
  talkId: TalkId;
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

export function UnfavoriteClipButton({ clipId, onError, onMutate }: UnfavoriteClipButtonProps) {
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
}: UnfavoriteSpeakerButtonProps) {
  const { isLoading, mutate } = useMutation(api.users.unfavoriteSpeaker, { onError });

  const handleRemove = () => {
    if (onMutate) {
      onMutate();
    }
    mutate({ speakerId });
  };

  return <UnfavoriteButton disabled={isLoading} onRemove={handleRemove} />;
}

export function UnfavoriteTalkButton({ onError, onMutate, talkId }: UnfavoriteTalkButtonProps) {
  const { isLoading, mutate } = useMutation(api.users.unfavoriteTalk, { onError });

  const handleRemove = () => {
    if (onMutate) {
      onMutate();
    }
    mutate({ talkId });
  };

  return <UnfavoriteButton disabled={isLoading} onRemove={handleRemove} />;
}
