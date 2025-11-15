'use client';

import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ClipCardProps = {
  favorited?: boolean;
  speaker?: {
    firstName: string;
    imageUrl?: string;
    lastName: string;
    slug: string;
  };
  clip: {
    _id: string;
    description?: string;
    slug: string;
    title: string;
  };
};

export function ClipCard({ favorited, speaker, clip }: ClipCardProps) {
  const speakerName = speaker ? `${speaker.firstName} ${speaker.lastName}` : undefined;
  const speakerInitials = speaker ? `${speaker.firstName[0]}${speaker.lastName[0]}` : undefined;
  const clipUrl = `/clips/${clip.slug}`;

  return (
    <Card className="group min-w-0 transition-all hover:shadow-md" render={<Link href={clipUrl} />}>
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
              ★
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
              {speaker.imageUrl && <AvatarImage alt={speakerName} src={speaker.imageUrl} />}
              <AvatarFallback>{speakerInitials}</AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground text-sm">{speakerName}</span>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
