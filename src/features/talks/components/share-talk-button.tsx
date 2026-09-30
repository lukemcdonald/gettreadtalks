'use client';

import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { ShareButton } from '@/components/share-button';
import { talkTrackProps, track } from '@/lib/analytics';

interface ShareTalkButtonProps {
  speaker?: Pick<Speaker, 'slug'> | null;
  talk: Pick<Talk, '_id' | 'slug' | 'title'>;
}

export function ShareTalkButton({ speaker, talk }: ShareTalkButtonProps) {
  return (
    <ShareButton
      onShare={(method) =>
        track('talk_shared', {
          method,
          ...talkTrackProps(talk, speaker),
        })
      }
      title={talk.title}
    />
  );
}
