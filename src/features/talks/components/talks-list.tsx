import type { TalkWithSpeaker } from '@/features/talks/types';

import { GridList } from '@/components/grid-list';
import { TalkCard } from './talk-card';

interface TalksListProps {
  talks: TalkWithSpeaker[];
}

/**
 * Renders a grid of talk cards.
 * Returns null when empty - parent components handle empty state.
 */
export function TalksList({ talks }: TalksListProps) {
  if (talks.length === 0) {
    return null;
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
