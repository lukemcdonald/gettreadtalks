'use client';

import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { StarIcon } from 'lucide-react';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { getSpeakerInitials, getSpeakerName } from '@/features/speakers';

type TalkCardProps = {
  featured?: boolean;
  favorited?: boolean;
  finished?: boolean;
  speaker?: Pick<Speaker, 'firstName' | 'lastName' | 'imageUrl' | 'slug'>;
  talk: Pick<Talk, 'description' | 'slug' | 'title'>;
};

export function TalkCard({ featured, favorited, finished, speaker, talk }: TalkCardProps) {
  const hasStatusIndicators = featured || favorited || finished;
  const speakerName = speaker ? getSpeakerName(speaker) : '';
  const accessibleLabel = speakerName ? `${talk.title} by ${speakerName}` : talk.title;

  return (
    <Card
      className="group transition-all duration-200 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:scale-[1.01] hover:shadow-lg"
      render={<Link aria-label={accessibleLabel} href={`/talks/${talk.slug}`} />}
    >
      <CardContent className="flex items-start gap-4 p-6">
        {speaker && (
          <Avatar className="size-12 shrink-0">
            {speaker.imageUrl && <AvatarImage alt={speakerName} src={speaker.imageUrl} />}
            <AvatarFallback className="text-base">{getSpeakerInitials(speaker)}</AvatarFallback>
          </Avatar>
        )}
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 min-w-0 flex-1 font-semibold text-lg leading-tight group-hover:text-primary sm:text-xl">
              {talk.title}
            </h3>
            {hasStatusIndicators && (
              <div
                aria-hidden="true"
                className="flex shrink-0 items-center gap-1.5 pt-0.5"
                title={[featured && 'Featured', favorited && 'Favorited', finished && 'Finished']
                  .filter(Boolean)
                  .join(', ')}
              >
                {featured && (
                  <span
                    aria-hidden="true"
                    className="size-2 rounded-full bg-primary"
                    title="Featured"
                  />
                )}
                {favorited && (
                  <StarIcon aria-hidden="true" className="size-3 fill-yellow-500 text-yellow-500" />
                )}
                {finished && (
                  <span
                    aria-hidden="true"
                    className="size-2 rounded-full bg-green-500"
                    title="Finished"
                  />
                )}
              </div>
            )}
          </div>
          {speaker && <p className="font-semibold text-muted-foreground text-sm">{speakerName}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
