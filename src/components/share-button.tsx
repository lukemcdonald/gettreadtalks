'use client';

import { useState } from 'react';
import { CheckIcon, ShareIcon } from 'lucide-react';

import { ActionIconButton } from '@/components/ui';

type ShareMethod = 'clipboard' | 'share_api';

interface ShareButtonProps {
  onShare?: (method: ShareMethod) => void;
  title: string;
}

export function ShareButton({ onShare, title }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        onShare?.('share_api');
        return;
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      onShare?.('clipboard');
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
