'use client';

import { useCallback, useState } from 'react';
import { CheckIcon, ShareIcon } from 'lucide-react';

import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui';

interface ShareTalkButtonProps {
  title: string;
  url: string;
}

export function ShareTalkButton({ title, url }: ShareTalkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    // Try Web Share API first (mobile/modern browsers)
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
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
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  }, [title, url]);

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
