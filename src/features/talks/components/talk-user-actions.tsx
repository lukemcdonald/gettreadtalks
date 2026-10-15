'use client';

import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { AuthProvider } from '@/components/auth-provider';
import { FeatureTalkButton } from '@/features/talks/components/feature-talk-button';
import { FavoriteTalkButton } from '@/features/users/components/favorite-talk-button';
import { FinishTalkButton } from '@/features/users/components/finish-talk-button';

interface TalkUserActionsProps {
  speaker: Pick<Speaker, '_id' | 'slug'> | null;
  talk: Pick<Talk, '_id' | 'slug' | 'title'>;
}

export function TalkUserActions({ speaker, talk }: TalkUserActionsProps) {
  return (
    <AuthProvider>
      <FavoriteTalkButton speaker={speaker} talk={talk} />
      <FinishTalkButton speaker={speaker} talk={talk} />
      <FeatureTalkButton speaker={speaker} talk={talk} />
    </AuthProvider>
  );
}
