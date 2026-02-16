'use client';

import type { TalkId } from '../types';

import { useCallback, useState } from 'react';
import { CheckIcon, ShareIcon } from 'lucide-react';

import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui';
import { useAnalytics } from '@/lib/analytics';

interface ShareTalkButtonProps {
  talkId: TalkId;
  title: string;
  url: string;
}

export function ShareTalkButton({ talkId, title, url }: ShareTalkButtonProps) {
  const [copied, setCopied] = useState(false);
  const { track } = useAnalytics();

  const handleShare = useCallback(async () => {
    // Try Web Share API first (mobile/modern browsers)
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        track('talk_shared', { method: 'share_api', talk_id: talkId });
        return;
      } catch (error) {
        // User cancelled or share failed, fall through to clipboard
        if ((error as Error).name === 'AbortError') {
          return;
        }
      }
    }

    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(url);
      track('talk_shared', { method: 'clipboard', talk_id: talkId });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  }, [talkId, title, url, track]);

  return (
    <Tooltip>
      <TooltipTrigger
        render={() => (
          <Button
            className="rounded-full"
            onClick={handleShare}
            size="icon"
            type="button"
            variant="default"
          >
            {copied ? <CheckIcon className="size-4" /> : <ShareIcon className="size-4" />}
          </Button>
        )}
      />

      <TooltipContent>
        <p>{copied ? 'Link copied!' : 'Share this talk'}</p>
      </TooltipContent>
    </Tooltip>
  );
}
