'use client';

import type { Doc } from '@/convex/_generated/dataModel';

import { ShareButton } from '@/components/share-button';
import { getSpeakerName } from '@/features/speakers/utils';
import { speakerTrackProps, track } from '@/lib/analytics';

interface ShareSpeakerButtonProps {
  speaker: Pick<Doc<'speakers'>, '_id' | 'firstName' | 'lastName' | 'slug'>;
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
