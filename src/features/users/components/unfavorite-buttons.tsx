'use client';

import type { ClipId } from '@/features/clips/types';
import type { SpeakerId } from '@/features/speakers/types';
import type { TalkId } from '@/features/talks/types';

import { HeartMinusIcon } from 'lucide-react';

import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui';
import { api } from '@/convex/_generated/api';
import { revalidateUserLists } from '@/features/users/actions/revalidate-user-lists';
import { useMutation } from '@/hooks';

interface OptimisticCallbacks {
  onError?: () => void;
  onMutate?: () => void;
}

interface UnfavoriteButtonProps {
  loading?: boolean;
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

function UnfavoriteButton({ loading, onRemove }: UnfavoriteButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={() => (
          <Button
            loading={loading}
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

export function UnfavoriteClipButton({
  clipId,
  onError,
  onMutate,
}: UnfavoriteClipButtonProps) {
  const { isLoading, mutate } = useMutation(api.users.unfavoriteClip, {
    onError,
    onSuccess: () => {
      void revalidateUserLists({ refreshPage: true });
    },
  });

  const handleRemove = () => {
    if (onMutate) {
      onMutate();
    }
    mutate({ clipId });
  };

  return <UnfavoriteButton loading={isLoading} onRemove={handleRemove} />;
}

export function UnfavoriteSpeakerButton({
  onError,
  onMutate,
  speakerId,
}: UnfavoriteSpeakerButtonProps) {
  const { isLoading, mutate } = useMutation(api.users.unfavoriteSpeaker, {
    onError,
    onSuccess: () => {
      void revalidateUserLists({ refreshPage: true });
    },
  });

  const handleRemove = () => {
    if (onMutate) {
      onMutate();
    }
    mutate({ speakerId });
  };

  return <UnfavoriteButton loading={isLoading} onRemove={handleRemove} />;
}

export function UnfavoriteTalkButton({
  onError,
  onMutate,
  talkId,
}: UnfavoriteTalkButtonProps) {
  const { isLoading, mutate } = useMutation(api.users.unfavoriteTalk, {
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

  return <UnfavoriteButton loading={isLoading} onRemove={handleRemove} />;
}
