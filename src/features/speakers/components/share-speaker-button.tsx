'use client';

import type { SpeakerId } from '../types';

import { ShareButton } from '@/components/share-button';
import { useAnalytics } from '@/lib/analytics';

interface ShareSpeakerButtonProps {
  speakerId: SpeakerId;
  speakerName: string;
}

export function ShareSpeakerButton({ speakerId, speakerName }: ShareSpeakerButtonProps) {
  const { track } = useAnalytics();

  return (
    <ShareButton
      onShare={(method) => track('speaker_shared', { method, speaker_id: speakerId })}
      title={speakerName}
    />
  );
}
