import type { Collection } from '@/features/collections/types';
import type { Speaker } from '@/features/speakers/types';

import { MediaCardTitle } from '@/components/media-card';
import { Card, CardDescription } from '@/components/ui';
import { FauxLink } from '@/components/ui/link';
import { CollectionCardSpeaker } from '@/features/collections/components/collection-card-speaker';
import { buildCollectionPath } from '@/features/collections/utils';
import { pluralize } from '@/utils';

const EMPTY_SPEAKERS: Pick<Speaker, 'firstName' | 'lastName' | 'slug'>[] = [];

interface CollectionCardProps {
  collection: Pick<Collection, 'description' | 'slug' | 'title'>;
  headingLevel?: 2 | 3;
  speakers?: Pick<Speaker, 'firstName' | 'lastName' | 'slug'>[];
  talkCount?: number;
}

export function CollectionCard({
  collection,
  headingLevel,
  speakers = EMPTY_SPEAKERS,
  talkCount,
}: CollectionCardProps) {
  return (
    <Card className="group card-interactive relative flex flex-col gap-3 border-0 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-0.5">
          <MediaCardTitle level={headingLevel}>
            <FauxLink
              data-testid="collection-card"
              href={buildCollectionPath(collection)}
            >
              {collection.title}
            </FauxLink>
          </MediaCardTitle>

          {!!collection.description && (
            <CardDescription className="line-clamp-2">
              {collection.description}
            </CardDescription>
          )}
        </div>

        {talkCount !== undefined && (
          <span className="text-muted-foreground shrink-0 pt-0.5 text-sm">
            {talkCount} {pluralize(talkCount, 'talk', 'talks')}
          </span>
        )}
      </div>

      {speakers.length > 0 && (
        <div className="flex -space-x-2">
          {speakers.map((speaker) => (
            <CollectionCardSpeaker key={speaker.slug} speaker={speaker} />
          ))}
        </div>
      )}
    </Card>
  );
}
