'use client';

import type { Doc } from '@/convex/_generated/dataModel';

import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type TalkCardProps = {
  featured?: boolean;
  favorited?: boolean;
  finished?: boolean;
  speaker?: Pick<Doc<'speakers'>, 'firstName' | 'lastName' | 'imageUrl' | 'slug'>;
  talk: Pick<Doc<'talks'>, 'description' | 'slug' | 'title'>;
};

export function TalkCard({ featured, favorited, finished, speaker, talk }: TalkCardProps) {
  const speakerName = speaker ? `${speaker.firstName} ${speaker.lastName}` : undefined;
  const speakerInitials = speaker ? `${speaker.firstName[0]}${speaker.lastName[0]}` : undefined;

  return (
    <Card
      className="group min-w-0 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
      render={<Link href={`/talks/${talk.slug}`} />}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-3 flex-1 group-hover:text-primary">
            {talk.title}
          </CardTitle>
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
                ★
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
