'use client';

import { CheckIcon, ShareIcon } from 'lucide-react';
import { useState } from 'react';

import { ActionButton, ActionIconButton } from '@/components/ui';

type ShareMethod = 'clipboard' | 'share_api';

interface ShareButtonProps {
  appearance?: 'icon' | 'label';
  onShare?: (method: ShareMethod) => void;
  title: string;
}

export function ShareButton({
  appearance = 'icon',
  onShare,
  title,
}: ShareButtonProps) {
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

  if (appearance === 'label') {
    return (
      <ActionButton
        icon={copied ? CheckIcon : ShareIcon}
        label={copied ? 'Link copied' : 'Share'}
        onClick={handleShare}
      />
    );
  }

  return (
    <ActionIconButton
      label={copied ? 'Link copied!' : 'Share'}
      onClick={handleShare}
    >
      {copied ? (
        <CheckIcon strokeWidth={2.5} />
      ) : (
        <ShareIcon strokeWidth={2.5} />
      )}
    </ActionIconButton>
  );
}
