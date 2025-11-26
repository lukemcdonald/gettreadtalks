'use client';

import type { Speaker } from '@/features/speakers/types';

import { SpeakerAvatar } from '@/components/speaker-avatar';
import { Card, CardDescription, CardLink, CardTitle } from '@/components/ui/card';
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
    <Card
      className="relative flex-row items-center gap-4 p-4"
      data-status={statusLabel}
      variant="interactive"
    >
      {speaker && <SpeakerAvatar speaker={speaker} />}
      <div className="flex-1 space-y-1">
        <CardTitle>
          <CardLink href={`/speakers/${speaker.slug}`}>{speakerName}</CardLink>
        </CardTitle>
        {speaker.role && <CardDescription>{speaker.role}</CardDescription>}
      </div>
    </Card>
  );
}
