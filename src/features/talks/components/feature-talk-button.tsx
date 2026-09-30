'use client';

import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { StarIcon } from 'lucide-react';

import { ToggleIconButton } from '@/components/ui';
import { useToggleTalkFeatured } from '@/features/talks/hooks/use-toggle-talk-featured';
import { useIsAdmin } from '@/features/users/hooks/use-is-admin';

interface FeatureTalkButtonProps {
  speaker?: Pick<Speaker, '_id' | 'slug'> | null;
  talk: Pick<Talk, '_id' | 'slug'>;
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
