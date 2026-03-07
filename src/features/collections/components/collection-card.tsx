import type { Collection } from '@/features/collections/types';
import type { Speaker } from '@/features/speakers/types';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { FauxLink } from '@/components/ui/link';
import { CollectionCardSpeaker } from '@/features/collections/components/collection-card-speaker';

interface CollectionCardProps {
  collection: Pick<Collection, 'description' | 'slug' | 'title'>;
  speakers?: Pick<Speaker, 'firstName' | 'lastName' | 'imageUrl' | 'slug'>[];
  talkCount?: number;
}

export function CollectionCard({ collection, speakers = [], talkCount }: CollectionCardProps) {
  const displaySpeakers = speakers.slice(0, 3);
  const remainingCount = speakers.length > 3 ? speakers.length - 3 : 0;

  return (
    <Card className="card-interactive">
      <CardHeader className="grow content-start gap-1.5">
        <CardTitle render={<h3 aria-label={collection.title} className="line-clamp-2 text-base" />}>
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
              {displaySpeakers.map((speaker) => (
                <CollectionCardSpeaker key={speaker.slug} speaker={speaker} />
              ))}
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
