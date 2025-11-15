'use client';

import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type SpeakerPreview = {
  firstName: string;
  imageUrl?: string;
  lastName: string;
  slug: string;
};

type CollectionCardProps = {
  collection: {
    _id: string;
    description?: string;
    slug: string;
    title: string;
  };
  speakers?: SpeakerPreview[];
  talkCount?: number;
};

export function CollectionCard({ collection, speakers = [], talkCount }: CollectionCardProps) {
  const displaySpeakers = speakers.slice(0, 3);
  const remainingCount = speakers.length > 3 ? speakers.length - 3 : 0;

  return (
    <Card
      className="group transition-all hover:shadow-md"
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
                const speakerName = `${speaker.firstName} ${speaker.lastName}`;
                const speakerInitials = `${speaker.firstName[0]}${speaker.lastName[0]}`;

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
