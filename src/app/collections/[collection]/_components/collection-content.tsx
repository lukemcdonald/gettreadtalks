import type { CollectionData } from '@/features/collections/types';
import type { TalkWithSpeaker } from '@/features/talks/types';

import { GridList } from '@/components/grid-list';
import { TalkCard } from '@/features/talks/components/talk-card';

interface CollectionContentProps {
  talks: CollectionData['talks'];
}

export function CollectionContent({ talks }: CollectionContentProps) {
  return (
    <GridList>
      {talks.map((talk: TalkWithSpeaker) => (
        <TalkCard
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
