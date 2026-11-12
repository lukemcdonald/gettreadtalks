import type { Speaker } from '@/features/speakers/types';

import { Pagination } from '@/components/pagination';
import { SpeakersList } from '@/features/speakers/components/speakers-list';

interface SpeakerGroup {
  items: Speaker[];
  letter: string;
  range: string;
}

interface SpeakersContentProps {
  continueCursor: string;
  groups: SpeakerGroup[];
  hasActiveFilters: boolean;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function SpeakersContent({
  continueCursor,
  groups,
  hasActiveFilters,
  hasNextPage,
  hasPrevPage,
}: SpeakersContentProps) {
  const itemCount = groups.reduce(
    (total, group) => total + group.items.length,
    0
  );

  return (
    <>
      <SpeakersList groups={groups} hasActiveFilters={hasActiveFilters} />
      {itemCount > 0 ? (
        <Pagination
          continueCursor={continueCursor}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          itemCount={itemCount}
        />
      ) : null}
    </>
  );
}
