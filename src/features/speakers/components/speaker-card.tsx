import type { Speaker } from '@/features/speakers/types';

import { MediaCard } from '@/components/media-card';
import { SpeakerAvatar } from '@/features/speakers/components/speaker-avatar';
import { buildSpeakerPath, getSpeakerName } from '@/features/speakers/utils';

interface SpeakerCardProps {
  headingLevel?: 2 | 3;
  speaker: Pick<
    Speaker,
    'featured' | 'firstName' | 'lastName' | 'role' | 'slug'
  >;
}

export function SpeakerCard({ headingLevel, speaker }: SpeakerCardProps) {
  const speakerName = getSpeakerName(speaker);

  return (
    <MediaCard
      data-testid="speaker-card"
      headingLevel={headingLevel}
      href={buildSpeakerPath(speaker)}
      media={<SpeakerAvatar speaker={speaker} />}
      subtitle={speaker.role}
      title={speakerName}
    />
  );
}
