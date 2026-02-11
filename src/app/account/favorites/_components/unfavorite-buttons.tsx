'use client';

import type { Id } from '@/convex/_generated/dataModel';

import { Button } from '@/components/ui';
import { api } from '@/convex/_generated/api';
import { useMutation } from '@/hooks';

interface UnfavoriteTalkButtonProps {
  talkId: Id<'talks'>;
}

export function UnfavoriteTalkButton({ talkId }: UnfavoriteTalkButtonProps) {
  const { isLoading, mutate } = useMutation(api.users.unfavoriteTalk);

  return (
    <Button disabled={isLoading} onClick={() => mutate({ talkId })} size="xs" variant="ghost">
      Unfavorite
    </Button>
  );
}

interface UnfavoriteSpeakerButtonProps {
  speakerId: Id<'speakers'>;
}

export function UnfavoriteSpeakerButton({ speakerId }: UnfavoriteSpeakerButtonProps) {
  const { isLoading, mutate } = useMutation(api.users.unfavoriteSpeaker);

  return (
    <Button disabled={isLoading} onClick={() => mutate({ speakerId })} size="xs" variant="ghost">
      Unfavorite
    </Button>
  );
}

interface UnfavoriteClipButtonProps {
  clipId: Id<'clips'>;
}

export function UnfavoriteClipButton({ clipId }: UnfavoriteClipButtonProps) {
  const { isLoading, mutate } = useMutation(api.users.unfavoriteClip);

  return (
    <Button disabled={isLoading} onClick={() => mutate({ clipId })} size="xs" variant="ghost">
      Unfavorite
    </Button>
  );
}
