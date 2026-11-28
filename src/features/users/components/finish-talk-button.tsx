'use client';

import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { Authenticated } from 'convex/react';
import { CircleCheckIcon } from 'lucide-react';

import { ActionButton } from '@/components/ui';
import { useToggleTalkFinished } from '@/features/users/hooks/use-toggle-talk-finished';

interface FinishTalkButtonProps {
  speaker?: Pick<Speaker, '_id' | 'slug'> | null;
  talk: Pick<Talk, '_id' | 'slug'>;
}

function FinishButton({ speaker, talk }: FinishTalkButtonProps) {
  const { isFinished, isLoading, toggle } = useToggleTalkFinished({
    speaker,
    talk,
  });

  return (
    <ActionButton
      icon={CircleCheckIcon}
      label="Finished"
      loading={isLoading}
      onClick={toggle}
      pressed={isFinished}
    />
  );
}

export function FinishTalkButton({ speaker, talk }: FinishTalkButtonProps) {
  return (
    <Authenticated>
      <FinishButton speaker={speaker} talk={talk} />
    </Authenticated>
  );
}
