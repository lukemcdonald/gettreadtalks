'use client';

import type { Speaker } from '@/features/speakers/types';

import { memo } from 'react';

import { MediaCard } from '@/components/media-card';
import { getSpeakerName } from '@/features/speakers';
import { SpeakerAvatar } from '@/features/speakers/components';

type SpeakerCardProps = {
  favorited?: boolean;
  speaker: Pick<Speaker, 'featured' | 'firstName' | 'lastName' | 'imageUrl' | 'role' | 'slug'>;
};

export const SpeakerCard = memo(function SpeakerCard({ favorited, speaker }: SpeakerCardProps) {
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
});
