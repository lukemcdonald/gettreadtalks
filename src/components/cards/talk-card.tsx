'use client';

import type { Speaker } from '@/lib/features/speakers/types';
import type { Talk } from '@/lib/features/talks/types';

import { StarIcon } from 'lucide-react';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSpeakerInitials, getSpeakerName } from '@/lib/features/speakers';

type TalkCardProps = {
  featured?: boolean;
  favorited?: boolean;
  finished?: boolean;
  speaker?: Pick<Speaker, 'firstName' | 'lastName' | 'imageUrl' | 'slug'>;
  talk: Pick<Talk, 'description' | 'slug' | 'title'>;
};

export function TalkCard({ featured, favorited, finished, speaker, talk }: TalkCardProps) {
  return (
    <Card
      className="group transition-all duration-200 hover:shadow-lg"
      render={<Link href={`/talks/${talk.slug}`} />}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg group-hover:text-primary sm:text-xl">
              {talk.title}
            </CardTitle>
          </div>
          <div className="flex flex-shrink-0 flex-col gap-1">
            {featured && (
              <Badge className="bg-primary/10 text-primary text-xs" variant="secondary">
                Featured
              </Badge>
            )}
            {favorited && (
              <Badge
                className="bg-yellow-500/10 text-xs text-yellow-600 dark:text-yellow-400"
                variant="secondary"
              >
                <StarIcon className="size-4" />
              </Badge>
            )}
            {finished && (
              <Badge
                className="bg-green-500/10 text-green-600 text-xs dark:text-green-400"
                variant="secondary"
              >
                ✓
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      {speaker && (
        <CardContent>
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              {speaker.imageUrl && (
                <AvatarImage alt={getSpeakerName(speaker)} src={speaker.imageUrl} />
              )}
              <AvatarFallback>{getSpeakerInitials(speaker)}</AvatarFallback>
            </Avatar>
            <span className="font-medium text-muted-foreground text-sm">
              {getSpeakerName(speaker)}
            </span>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
