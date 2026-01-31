'use client';

import type { Speaker } from '@/features/speakers/types';

import { MediaCard } from '@/components/media-card';
import { SpeakerAvatar } from '@/features/speakers/components/speaker-avatar';
import { getSpeakerName } from '@/features/speakers/utils';

interface SpeakerCardProps {
  speaker: Pick<Speaker, 'featured' | 'firstName' | 'lastName' | 'imageUrl' | 'role' | 'slug'>;
}

export function SpeakerCard({ speaker }: SpeakerCardProps) {
  const speakerName = getSpeakerName(speaker);

  return (
    <MediaCard
      href={`/speakers/${speaker.slug}`}
      media={<SpeakerAvatar speaker={speaker} />}
      subtitle={speaker.role}
      title={speakerName}
    />
  );
}
