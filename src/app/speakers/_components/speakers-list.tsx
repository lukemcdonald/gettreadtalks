import type { Speaker } from '@/features/speakers/types';

import { AlphabeticalGrid } from '@/components/alphabetical-grid';
import { ListEmpty } from '@/components/list-empty';
import { SpeakerCard } from '@/features/speakers/components/speaker-card';

export interface SpeakerGroup {
  items: Speaker[];
  letter: string;
  range: string;
}

interface SpeakersListProps {
  groups: SpeakerGroup[];
  hasActiveFilters: boolean;
}

/**
 * Renders speakers in an alphabetical grid.
 * Data is pre-filtered and grouped on the server.
 */
export function SpeakersList({ groups, hasActiveFilters }: SpeakersListProps) {
  if (groups.length === 0) {
    return (
      <ListEmpty
        clearPath="/speakers"
        description="Check back later for more speakers."
        filteredDescription="Try adjusting your filters."
        hasActiveFilters={hasActiveFilters}
        title="No speakers found"
      />
    );
  }

  return (
    <AlphabeticalGrid
      groups={groups.map((group) => ({
        items: group.items.map((speaker) => (
          <SpeakerCard
            key={speaker._id}
            speaker={{
              featured: speaker.featured,
              firstName: speaker.firstName,
              imageUrl: speaker.imageUrl,
              lastName: speaker.lastName,
              role: speaker.role,
              slug: speaker.slug,
            }}
          />
        )),
        letter: group.letter,
        range: group.range,
      }))}
    />
  );
}
