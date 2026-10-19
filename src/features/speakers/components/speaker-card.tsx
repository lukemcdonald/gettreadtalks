'use client';

import type { Speaker } from '@/features/speakers/types';

import { MediaCard } from '@/components/media-card';
import { SpeakerAvatar } from '@/features/speakers/components/speaker-avatar';
import { buildSpeakerUrl, getSpeakerName } from '@/features/speakers/utils';

interface SpeakerCardProps {
  speaker: Pick<
    Speaker,
    'featured' | 'firstName' | 'lastName' | 'imageUrl' | 'role' | 'slug'
  >;
}

export function SpeakerCard({ speaker }: SpeakerCardProps) {
  const speakerName = getSpeakerName(speaker);

  return (
    <MediaCard
      data-testid="speaker-card"
      href={buildSpeakerUrl(speaker.slug)}
      media={<SpeakerAvatar speaker={speaker} />}
      subtitle={speaker.role}
      title={speakerName}
    />
  );
}
