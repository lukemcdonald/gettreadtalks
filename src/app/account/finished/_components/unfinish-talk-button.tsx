'use client';

import type { Id } from '@/convex/_generated/dataModel';

import { Button } from '@/components/ui';
import { api } from '@/convex/_generated/api';
import { useMutation } from '@/hooks';

interface UnfinishTalkButtonProps {
  talkId: Id<'talks'>;
}

export function UnfinishTalkButton({ talkId }: UnfinishTalkButtonProps) {
  const { isLoading, mutate } = useMutation(api.users.unfinishTalk);

  return (
    <Button disabled={isLoading} onClick={() => mutate({ talkId })} size="xs" variant="ghost">
      Unfinish
    </Button>
  );
}
