'use client';

import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { Authenticated } from 'convex/react';
import { BookmarkIcon } from 'lucide-react';

import { ToggleIconButton } from '@/components/ui';
import { useToggleTalkFinished } from '@/features/users/hooks/use-toggle-talk-finished';

interface FinishTalkButtonProps {
  speaker?: Pick<Speaker, 'slug'> | null;
  talk: Pick<Talk, '_id' | 'slug'>;
}

function FinishButton({ speaker, talk }: FinishTalkButtonProps) {
  const { isFinished, isLoading, toggle } = useToggleTalkFinished({
    speaker,
    talk,
  });

  return (
    <ToggleIconButton
      activeLabel="Mark unfinished"
      icon={BookmarkIcon}
      inactiveLabel="Mark finished"
      isActive={isFinished}
      loading={isLoading}
      onToggle={toggle}
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
