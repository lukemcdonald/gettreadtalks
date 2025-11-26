'use client';

import type { Clip } from '@/features/clips/types';
import type { Speaker } from '@/features/speakers/types';

import { SpeakerAvatar } from '@/components/speaker-avatar';
import { Card, CardDescription, CardLink, CardTitle } from '@/components/ui/card';
import { getSpeakerName } from '@/features/speakers';

type ClipCardProps = {
  clip: Pick<Clip, 'description' | 'slug' | 'title'>;
  favorited?: boolean;
  speaker?: Pick<Speaker, 'firstName' | 'lastName' | 'imageUrl' | 'slug'>;
};

export function ClipCard({ clip, favorited, speaker }: ClipCardProps) {
  const speakerName = speaker ? getSpeakerName(speaker) : '';
  const statusLabels = [favorited && 'Favorited'];
  const statusLabel = statusLabels.filter(Boolean).join(', ');

  return (
    <Card
      className="relative flex-row items-center gap-4 p-4"
      data-status={statusLabel}
      variant="interactive"
    >
      {speaker && <SpeakerAvatar speaker={speaker} />}
      <div className="flex-1 space-y-1">
        <CardTitle>
          <CardLink href={`/clips/${clip.slug}`}>{clip.title}</CardLink>
        </CardTitle>
        {speakerName && <CardDescription>{speakerName}</CardDescription>}
      </div>
    </Card>
  );
}
