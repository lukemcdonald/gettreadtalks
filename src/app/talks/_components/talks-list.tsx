import type { Doc } from '@/convex/_generated/dataModel';

import { TalkCard } from '@/components/cards';
import { GridList } from '@/components/grid';
import { Empty, EmptyDescription } from '@/components/ui/empty';

type TalkWithSpeaker = Doc<'talks'> & {
  speaker: Doc<'speakers'> | null;
};

type TalksListProps = {
  talks: TalkWithSpeaker[];
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
    <GridList columns={{ default: 1, sm: 1, md: 1, lg: 1, xl: 1 }}>
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
