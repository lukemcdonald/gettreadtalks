import type { Doc } from '@/convex/_generated/dataModel';
import type { Speaker } from '@/features/speakers/types';

import { ListEmpty } from '@/components/list-empty';
import { Pagination } from '@/components/pagination';
import { ClipsList } from '@/features/clips/components';

type ClipWithSpeaker = Doc<'clips'> & {
  speaker: Speaker | null;
};

type ClipsContentProps = {
  clips: ClipWithSpeaker[];
  continueCursor: string;
  hasActiveFilters: boolean;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export function ClipsContent({
  clips,
  continueCursor,
  hasActiveFilters,
  hasNextPage,
  hasPrevPage,
}: ClipsContentProps) {
  if (clips.length === 0) {
    return (
      <ListEmpty
        clearPath="/clips"
        description="There are no clips available at this time."
        filteredDescription="No clips match your current filters. Try adjusting your search or clearing filters."
        hasActiveFilters={hasActiveFilters}
        title="No clips found"
      />
    );
  }

  return (
    <>
      <ClipsList clips={clips} />
      <Pagination
        continueCursor={continueCursor}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        itemCount={clips.length}
      />
    </>
  );
}
