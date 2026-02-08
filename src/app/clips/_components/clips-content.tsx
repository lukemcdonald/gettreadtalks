import type { Doc } from '@/convex/_generated/dataModel';
import type { Speaker } from '@/features/speakers/types';

import { Pagination } from '@/components/pagination';
import { Empty, EmptyDescription, EmptyTitle } from '@/components/ui';
import { ClipsList } from '@/features/clips/components/clips-list';

type ClipWithSpeaker = Doc<'clips'> & {
  speaker: Speaker | null;
};

interface ClipsContentProps {
  clips: ClipWithSpeaker[];
  continueCursor: string;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function ClipsContent({
  clips,
  continueCursor,
  hasNextPage,
  hasPrevPage,
}: ClipsContentProps) {
  if (clips.length === 0) {
    return (
      <Empty>
        <EmptyTitle>No clips found</EmptyTitle>
        <EmptyDescription>There are no clips available at this time.</EmptyDescription>
      </Empty>
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
