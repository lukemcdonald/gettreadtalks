'use client';

import type { TalkId } from '../types';

import { ShareButton } from '@/components/share-button';
import { talkTrackProps, track } from '@/lib/analytics';

interface ShareTalkButtonProps {
  speaker?: { slug: string } | null;
  talk: { _id: TalkId; slug: string; title: string };
}

export function ShareTalkButton({ speaker, talk }: ShareTalkButtonProps) {
  return (
    <ShareButton
      onShare={(method) =>
        track('talk_shared', {
          method,
          ...talkTrackProps(talk, speaker?.slug ?? ''),
        })
      }
      title={talk.title}
    />
  );
}
