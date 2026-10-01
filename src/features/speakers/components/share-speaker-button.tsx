'use client';

import type { Speaker } from '@/features/speakers/types';

import { ShareButton } from '@/components/share-button';
import { getSpeakerName } from '@/features/speakers/utils';
import { speakerTrackProps, track } from '@/services/analytics';

interface ShareSpeakerButtonProps {
  speaker: Pick<Speaker, '_id' | 'firstName' | 'lastName' | 'slug'>;
}

export function ShareSpeakerButton({ speaker }: ShareSpeakerButtonProps) {
  return (
    <ShareButton
      onShare={(method) =>
        track('speaker_shared', {
          method,
          ...speakerTrackProps(speaker),
        })
      }
      title={getSpeakerName(speaker)}
    />
  );
}
