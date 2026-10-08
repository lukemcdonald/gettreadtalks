'use client';

import type { Clip } from '@/features/clips/types';
import type { Speaker } from '@/features/speakers/types';

import { MediaCard } from '@/components/media-card';
import { getClipUrl } from '@/features/clips/utils';
import { SpeakerAvatar } from '@/features/speakers/components/speaker-avatar';
import { getSpeakerName } from '@/features/speakers/utils';

interface ClipCardProps {
  clip: Pick<Clip, 'description' | 'slug' | 'title'>;
  href?: string;
  speaker?: Pick<Speaker, 'firstName' | 'lastName' | 'imageUrl' | 'slug'>;
}

export function ClipCard({ clip, href, speaker }: ClipCardProps) {
  const speakerName = getSpeakerName(speaker);
  const accessibleLabel = speakerName
    ? `${clip.title} by ${speakerName}`
    : clip.title;

  return (
    <MediaCard
      ariaLabel={accessibleLabel}
      className="items-center"
      href={href ?? getClipUrl(clip.slug)}
      media={speaker ? <SpeakerAvatar speaker={speaker} /> : undefined}
      subtitle={speakerName}
      title={clip.title}
    />
  );
}
