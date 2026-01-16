'use client';

import type { TalkWithSpeaker } from '@/features/talks/types';

import { useRouter } from 'next/navigation';

import { Pagination } from '@/components/pagination';
import { Button, Empty, EmptyDescription, EmptyTitle } from '@/components/ui';
import { TalksList } from '@/features/talks/components';

type TalksContentProps = {
  continueCursor: string;
  hasActiveFilters: boolean;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  talks: TalkWithSpeaker[];
};

export function TalksContent({
  continueCursor,
  hasActiveFilters,
  hasNextPage,
  hasPrevPage,
  talks,
}: TalksContentProps) {
  const router = useRouter();

  function handleClearFilters() {
    router.push('/talks');
  }

  if (talks.length === 0) {
    return (
      <Empty>
        <EmptyTitle>No talks found</EmptyTitle>
        <EmptyDescription>
          {hasActiveFilters
            ? 'No talks match your current filters. Try adjusting your search or clearing filters.'
            : 'There are no talks available at this time.'}
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
      {/* Filtering is done server-side, so disable client-side filtering */}
      <TalksList enableFiltering={false} talks={talks} />
      <Pagination
        continueCursor={continueCursor}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        itemCount={talks.length}
      />
    </>
  );
}
