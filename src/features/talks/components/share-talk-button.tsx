'use client';

import type { TalkId } from '../types';

import { useState } from 'react';
import { CheckIcon, ShareIcon } from 'lucide-react';

import { ActionIconButton } from '@/components/ui';
import { useAnalytics } from '@/lib/analytics';

interface ShareTalkButtonProps {
  talkId: TalkId;
  title: string;
  url: string;
}

export function ShareTalkButton({ talkId, title, url }: ShareTalkButtonProps) {
  const [copied, setCopied] = useState(false);
  const { track } = useAnalytics();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        track('talk_shared', { method: 'share_api', talk_id: talkId });
        return;
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      track('talk_shared', { method: 'clipboard', talk_id: talkId });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  return (
    <ActionIconButton label={copied ? 'Link copied!' : 'Share'} onClick={handleShare}>
      {copied ? <CheckIcon strokeWidth={2.5} /> : <ShareIcon strokeWidth={2.5} />}
    </ActionIconButton>
  );
}
