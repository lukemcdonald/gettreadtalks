'use client';

import type { Clip } from '@/features/clips/types';
import type { Speaker } from '@/features/speakers/types';

import { MediaCard } from '@/components/media-card';
import { SpeakerAvatar } from '@/components/speaker-avatar';
import { getSpeakerName } from '@/features/speakers';

type ClipCardProps = {
  clip: Pick<Clip, 'description' | 'slug' | 'title'>;
  favorited?: boolean;
  speaker?: Pick<Speaker, 'firstName' | 'lastName' | 'imageUrl' | 'slug'>;
};

export function ClipCard({ clip, favorited, speaker }: ClipCardProps) {
  const speakerName = getSpeakerName(speaker);
  const accessibleLabel = speakerName ? `${clip.title} by ${speakerName}` : clip.title;
  const statusLabels = [favorited && 'Favorited'];
  const statusLabel = statusLabels.filter(Boolean).join(', ');

  return (
    <MediaCard
      ariaLabel={accessibleLabel}
      className="items-center"
      data-status={statusLabel}
      href={`/clips/${clip.slug}`}
      media={speaker ? <SpeakerAvatar speaker={speaker} /> : undefined}
      subtitle={speakerName}
      title={clip.title}
    />
  );
}
