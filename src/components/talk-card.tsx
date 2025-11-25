'use client';

import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import Link from 'next/link';

import { SpeakerAvatar } from '@/components/speaker-avatar';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { getSpeakerName } from '@/features/speakers';

type TalkCardProps = {
  featured?: boolean;
  favorited?: boolean;
  finished?: boolean;
  speaker?: Pick<Speaker, 'firstName' | 'lastName' | 'imageUrl' | 'slug'>;
  talk: Pick<Talk, 'description' | 'slug' | 'title'>;
};

export function TalkCard({ featured, favorited, finished, speaker, talk }: TalkCardProps) {
  const speakerName = speaker ? getSpeakerName(speaker) : '';
  const accessibleLabel = speakerName ? `${talk.title} by ${speakerName}` : talk.title;

  const statusLabels = [featured && 'Featured', favorited && 'Favorited', finished && 'Finished'];
  const statusLabel = statusLabels.filter(Boolean).join(', ');

  return (
    <Card
      className="relative flex-row items-center gap-4 space-x-3 p-4"
      data-status={statusLabel}
      render={<Link aria-label={accessibleLabel} href={`/talks/${talk.slug}`} />}
      variant="interactive"
    >
      {speaker && <SpeakerAvatar speaker={speaker} />}
      <div className="flex-1 space-y-1.5">
        <CardTitle>{talk.title}</CardTitle>
        {speaker && <CardDescription>{speakerName}</CardDescription>}
      </div>
    </Card>
  );
}
