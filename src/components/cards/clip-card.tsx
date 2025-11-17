'use client';

import type { Clip } from '@/lib/features/clips/types';
import type { Speaker } from '@/lib/features/speakers/types';

import { StarIcon } from 'lucide-react';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSpeakerInitials, getSpeakerName } from '@/lib/features/speakers';

type ClipCardProps = {
  clip: Pick<Clip, 'description' | 'slug' | 'title'>;
  favorited?: boolean;
  speaker?: Pick<Speaker, 'firstName' | 'lastName' | 'imageUrl' | 'slug'>;
};

export function ClipCard({ clip, favorited, speaker }: ClipCardProps) {
  return (
    <Card
      className="group min-w-0 transition-all hover:shadow-md"
      render={<Link href={`/clips/${clip.slug}`} />}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2 flex-1 group-hover:text-primary">
            {clip.title}
          </CardTitle>
          {favorited && (
            <Badge
              className="bg-yellow-500/10 text-xs text-yellow-600 dark:text-yellow-400"
              variant="secondary"
            >
              <StarIcon className="size-4" />
            </Badge>
          )}
        </div>
        {clip.description && (
          <p className="line-clamp-2 text-muted-foreground text-sm">{clip.description}</p>
        )}
      </CardHeader>

      {speaker && (
        <CardContent>
          <div className="flex items-center gap-2">
            <Avatar className="size-8">
              {speaker.imageUrl && (
                <AvatarImage alt={getSpeakerName(speaker)} src={speaker.imageUrl} />
              )}
              <AvatarFallback>{getSpeakerInitials(speaker)}</AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground text-sm">{getSpeakerName(speaker)}</span>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
