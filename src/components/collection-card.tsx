'use client';

import type { Collection } from '@/lib/features/collections/types';
import type { Speaker } from '@/lib/features/speakers/types';

import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSpeakerInitials, getSpeakerName } from '@/lib/features/speakers';

type CollectionCardProps = {
  collection: Pick<Collection, 'description' | 'slug' | 'title'>;
  speakers?: Pick<Speaker, 'firstName' | 'lastName' | 'imageUrl' | 'slug'>[];
  talkCount?: number;
};

export function CollectionCard({ collection, speakers = [], talkCount }: CollectionCardProps) {
  const displaySpeakers = speakers.slice(0, 3);
  const remainingCount = speakers.length > 3 ? speakers.length - 3 : 0;

  return (
    <Card
      className="group min-w-0 transition-all hover:shadow-md"
      render={<Link href={`/collections/${collection.slug}`} />}
    >
      <CardHeader>
        <CardTitle className="group-hover:text-primary">{collection.title}</CardTitle>
        {collection.description && (
          <p className="line-clamp-2 text-muted-foreground text-sm">{collection.description}</p>
        )}
        {talkCount !== undefined && (
          <p className="mt-2 text-muted-foreground text-sm">
            {talkCount} {talkCount === 1 ? 'Talk' : 'Talks'}
          </p>
        )}
      </CardHeader>

      {speakers.length > 0 && (
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="-space-x-2 flex">
              {displaySpeakers.map((speaker) => {
                const speakerName = getSpeakerName(speaker);
                const speakerInitials = getSpeakerInitials(speaker);

                return (
                  <Avatar className="size-8 border-2 border-background" key={speaker.slug}>
                    {speaker.imageUrl && <AvatarImage alt={speakerName} src={speaker.imageUrl} />}
                    <AvatarFallback className="text-xs">{speakerInitials}</AvatarFallback>
                  </Avatar>
                );
              })}
            </div>
            {remainingCount > 0 && (
              <span className="text-muted-foreground text-sm">+{remainingCount} more</span>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
