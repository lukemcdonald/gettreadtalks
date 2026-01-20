import type { TalkWithSpeaker } from '@/features/talks/types';

import { ListEmpty } from '@/components/list-empty';
import { Pagination } from '@/components/pagination';
import { TalksList } from '@/features/talks/components';

interface TalksContentProps {
  continueCursor: string;
  hasActiveFilters: boolean;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  talks: TalkWithSpeaker[];
}

export function TalksContent({
  continueCursor,
  hasActiveFilters,
  hasNextPage,
  hasPrevPage,
  talks,
}: TalksContentProps) {
  if (talks.length === 0) {
    return (
      <ListEmpty
        clearPath="/talks"
        description="There are no talks available at this time."
        filteredDescription="No talks match your current filters. Try adjusting your search or clearing filters."
        hasActiveFilters={hasActiveFilters}
        title="No talks found"
      />
    );
  }

  return (
    <>
      <TalksList talks={talks} />
      <Pagination
        continueCursor={continueCursor}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        itemCount={talks.length}
      />
    </>
  );
}
