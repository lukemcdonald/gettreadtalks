'use client';

import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { BookmarkIcon } from 'lucide-react';

import { ToggleIconButton } from '@/components/ui';
import { useCurrentUser } from '@/features/users/hooks/use-current-user';
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
  const { data: user } = useCurrentUser();

  if (!user) {
    return null;
  }

  return <FinishButton speaker={speaker} talk={talk} />;
}
