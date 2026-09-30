'use client';

import type { Doc } from '@/convex/_generated/dataModel';

import { ShareButton } from '@/components/share-button';
import { talkTrackProps, track } from '@/lib/analytics';

interface ShareTalkButtonProps {
  speaker?: Pick<Doc<'speakers'>, 'slug'> | null;
  talk: Pick<Doc<'talks'>, '_id' | 'slug' | 'title'>;
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
