'use client';

import type { Doc } from '@/convex/_generated/dataModel';
import type { Speaker } from '@/features/speakers/types';

import { useRouter } from 'next/navigation';

import { Pagination } from '@/components/pagination';
import { Button, Empty, EmptyDescription, EmptyTitle } from '@/components/ui';
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
  const router = useRouter();

  function handleClearFilters() {
    router.push('/clips');
  }

  if (clips.length === 0) {
    return (
      <Empty>
        <EmptyTitle>No clips found</EmptyTitle>
        <EmptyDescription>
          {hasActiveFilters
            ? 'No clips match your current filters. Try adjusting your search or clearing filters.'
            : 'There are no clips available at this time.'}
        </EmptyDescription>
        {!!hasActiveFilters && (
          <Button className="mt-4" onClick={handleClearFilters} variant="outline">
            Clear all filters
          </Button>
        )}
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
