'use client';

import type { TalkId } from '../types';

import { ShareButton } from '@/components/share-button';
import { track } from '@/lib/analytics';

interface ShareTalkButtonProps {
  talkId: TalkId;
  talkTitle: string;
}

export function ShareTalkButton({ talkId, talkTitle }: ShareTalkButtonProps) {
  return (
    <ShareButton
      onShare={(method) => track('talk_shared', { method, talk_id: talkId })}
      title={talkTitle}
    />
  );
}
