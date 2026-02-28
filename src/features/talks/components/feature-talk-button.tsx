'use client';

import type { TalkId } from '../types';

import { StarIcon } from 'lucide-react';

import { ToggleIconButton } from '@/components/ui';
import { useToggleTalkFeatured } from '@/features/talks/hooks/use-toggle-talk-featured';
import { useIsAdmin } from '@/features/users/hooks/use-is-admin';

interface FeatureTalkButtonProps {
  talkId: TalkId;
}

export function FeatureTalkButton({ talkId }: FeatureTalkButtonProps) {
  const isAdmin = useIsAdmin();
  const { isFeatured, isLoading, toggle } = useToggleTalkFeatured(talkId);

  if (!isAdmin) {
    return null;
  }

  return (
    <ToggleIconButton
      activeLabel="Unfeature"
      disabled={isLoading}
      icon={StarIcon}
      inactiveLabel="Feature"
      isActive={isFeatured}
      onToggle={toggle}
    />
  );
}
