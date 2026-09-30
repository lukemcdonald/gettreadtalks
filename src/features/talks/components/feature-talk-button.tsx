'use client';

import type { TalkId } from '../types';

import { StarIcon } from 'lucide-react';

import { ToggleIconButton } from '@/components/ui';
import { useToggleTalkFeatured } from '@/features/talks/hooks/use-toggle-talk-featured';
import { useIsAdmin } from '@/features/users/hooks/use-is-admin';

interface FeatureTalkButtonProps {
  speaker?: { slug: string } | null;
  talk: { _id: TalkId; slug: string };
}

export function FeatureTalkButton({ speaker, talk }: FeatureTalkButtonProps) {
  const isAdmin = useIsAdmin();
  const { isFeatured, isLoading, toggle } = useToggleTalkFeatured({
    speaker,
    talk,
  });

  if (!isAdmin) {
    return null;
  }

  return (
    <ToggleIconButton
      activeLabel="Unfeature"
      icon={StarIcon}
      inactiveLabel="Feature"
      isActive={isFeatured}
      loading={isLoading}
      onToggle={toggle}
    />
  );
}
