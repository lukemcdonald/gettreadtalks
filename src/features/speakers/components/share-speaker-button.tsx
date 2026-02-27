'use client';

import type { SpeakerId } from '../types';

import { useState } from 'react';
import { CheckIcon, ShareIcon } from 'lucide-react';

import { ActionIconButton } from '@/components/ui';
import { useAnalytics } from '@/lib/analytics';

interface ShareSpeakerButtonProps {
  speakerId: SpeakerId;
  speakerName: string;
}

export function ShareSpeakerButton({ speakerId, speakerName }: ShareSpeakerButtonProps) {
  const [copied, setCopied] = useState(false);
  const { track } = useAnalytics();

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: speakerName,
          url,
        });
        track('speaker_shared', {
          method: 'share_api',
          speaker_id: speakerId,
        });
        return;
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      track('speaker_shared', {
        method: 'clipboard',
        speaker_id: speakerId,
      });
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
