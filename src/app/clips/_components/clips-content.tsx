import type { Doc } from '@/convex/_generated/dataModel';
import type { Speaker } from '@/features/speakers/types';

import { ListEmpty } from '@/components/list-empty';
import { Pagination } from '@/components/pagination';
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
      <ListEmpty description="There are no clips available at this time." title="No clips found" />
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
