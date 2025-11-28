import type { CollectionData } from '@/features/collections/types';

import { GridList } from '@/components/grid-list';
import { TalkCard } from '@/components/talk-card';

type CollectionContentProps = {
  talks: CollectionData['talks'];
};

export function CollectionContent({ talks }: CollectionContentProps) {
  return (
    <GridList>
      {talks.map((talk) => (
        <TalkCard
          featured={talk.featured}
          key={talk._id}
          speaker={
            talk.speaker
              ? {
                  firstName: talk.speaker.firstName,
                  imageUrl: talk.speaker.imageUrl,
                  lastName: talk.speaker.lastName,
                  slug: talk.speaker.slug,
                }
              : undefined
          }
          talk={{
            description: talk.description,
            slug: talk.slug,
            title: talk.title,
          }}
        />
      ))}
    </GridList>
  );
}
