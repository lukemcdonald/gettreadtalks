import type { TalkWithSpeakerAndTopics } from '@/features/talks/types';

import { GridList } from '@/components/grid-list';
import { Empty, EmptyDescription } from '@/components/ui';
import { TalkCard } from './talk-card';

type TalksListProps = {
  talks: TalkWithSpeakerAndTopics[];
};

export function TalksList({ talks }: TalksListProps) {
  if (talks.length === 0) {
    return (
      <Empty>
        <EmptyDescription>No talks found</EmptyDescription>
      </Empty>
    );
  }

  return (
    <GridList columns={{ default: 1, sm: 1, md: 2, lg: 2, xl: 2 }}>
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
