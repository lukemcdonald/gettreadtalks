'use client';

import type { TalkId } from '../types';

import { StarIcon, StarOffIcon } from 'lucide-react';

import { ActionIconButton } from '@/components/ui';
import { useToggleTalkFeatured } from '@/features/talks/hooks/use-toggle-talk-featured';
import { useIsAdmin } from '@/features/users/hooks/use-is-admin';

interface FeatureTalkButtonProps {
  featured: boolean;
  talkId: TalkId;
}

export function FeatureTalkButton({ featured, talkId }: FeatureTalkButtonProps) {
  const isAdmin = useIsAdmin();
  const { isFeatured, isLoading, toggle } = useToggleTalkFeatured(talkId, featured);

  if (!isAdmin) {
    return null;
  }

  return (
    <ActionIconButton
      disabled={isLoading}
      label={isFeatured ? 'Unfeature' : 'Feature'}
      onClick={toggle}
    >
      {isFeatured ? <StarOffIcon strokeWidth={2.5} /> : <StarIcon strokeWidth={2.5} />}
    </ActionIconButton>
  );
}
