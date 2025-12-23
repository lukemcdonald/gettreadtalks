'use client';

import type { Collection } from '@/features/collections/types';
import type { Speaker } from '@/features/speakers/types';

import { FauxLink } from '@/components/faux-link';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { getSpeakerInitials, getSpeakerName } from '@/features/speakers';

type CollectionCardProps = {
  collection: Pick<Collection, 'description' | 'slug' | 'title'>;
  speakers?: Pick<Speaker, 'firstName' | 'lastName' | 'imageUrl' | 'slug'>[];
  talkCount?: number;
};

export function CollectionCard({ collection, speakers = [], talkCount }: CollectionCardProps) {
  const displaySpeakers = speakers.slice(0, 3);
  const remainingCount = speakers.length > 3 ? speakers.length - 3 : 0;

  return (
    <Card className="card-interactive">
      <CardHeader className="grow content-start gap-4">
        <CardTitle>
          <FauxLink href={`/collections/${collection.slug}`}>{collection.title}</FauxLink>
        </CardTitle>

        {!!collection.description && <CardDescription>{collection.description}</CardDescription>}
        {talkCount !== undefined && (
          <CardDescription>
            {talkCount} {talkCount === 1 ? 'Talk' : 'Talks'}
          </CardDescription>
        )}
      </CardHeader>

      {speakers.length > 0 && (
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {displaySpeakers.map((speaker) => {
                const speakerName = getSpeakerName(speaker);
                const speakerInitials = getSpeakerInitials(speaker);

                return (
                  <Avatar className="size-8 border-2 border-background" key={speaker.slug}>
                    {!!speaker.imageUrl && <AvatarImage alt={speakerName} src={speaker.imageUrl} />}
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
