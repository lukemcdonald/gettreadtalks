import type { ClipWithSpeaker } from '@/features/clips/types';

import { Pagination } from '@/components/pagination';
import { Empty, EmptyDescription, EmptyTitle } from '@/components/ui';
import { ClipsList } from '@/features/clips/components/clips-list';

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
  const isEmpty = clips.length === 0;

  return (
    <>
      {isEmpty ? (
        <Empty>
          <EmptyTitle>No clips found</EmptyTitle>
          <EmptyDescription>
            There are no clips available at this time.
          </EmptyDescription>
        </Empty>
      ) : (
        <ClipsList clips={clips} />
      )}
      {!isEmpty || hasNextPage || hasPrevPage ? (
        <Pagination
          continueCursor={continueCursor}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          itemCount={clips.length}
        />
      ) : null}
    </>
  );
}
