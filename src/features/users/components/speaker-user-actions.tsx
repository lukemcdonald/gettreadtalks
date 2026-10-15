'use client';

import type { Speaker } from '@/features/speakers/types';

import { AuthProvider } from '@/components/auth-provider';
import { FavoriteSpeakerButton } from '@/features/users/components/favorite-speaker-button';

interface SpeakerUserActionsProps {
  speaker: Pick<Speaker, '_id' | 'slug'>;
}

export function SpeakerUserActions({ speaker }: SpeakerUserActionsProps) {
  return (
    <AuthProvider>
      <FavoriteSpeakerButton speaker={speaker} />
    </AuthProvider>
  );
}
