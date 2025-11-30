'use client';

import type { Speaker } from '@/features/speakers/types';

import { MediaCard } from '@/components/media-card';
import { SpeakerAvatar } from '@/components/speaker-avatar';
import { getSpeakerName } from '@/features/speakers';

type SpeakerCardProps = {
  favorited?: boolean;
  speaker: Pick<Speaker, 'featured' | 'firstName' | 'lastName' | 'imageUrl' | 'role' | 'slug'>;
};

export function SpeakerCard({ favorited, speaker }: SpeakerCardProps) {
  const speakerName = getSpeakerName(speaker);
  const statusLabels = [speaker.featured && 'Featured', favorited && 'Favorited'];
  const statusLabel = statusLabels.filter(Boolean).join(', ');

  return (
    <MediaCard
      data-status={statusLabel}
      href={`/speakers/${speaker.slug}`}
      media={<SpeakerAvatar speaker={speaker} />}
      subtitle={speaker.role}
      title={speakerName}
    />
  );
}
