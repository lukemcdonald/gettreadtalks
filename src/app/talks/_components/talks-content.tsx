import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { Suspense } from 'react';

import { Pagination } from '@/app/talks/_components/pagination';
import { TalksList, TalksListSkeleton } from '@/features/talks/components';

type TalkWithSpeaker = Talk & { speaker: Speaker | null };
type TalksContentProps = {
  continueCursor: string;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  talks: TalkWithSpeaker[];
};

export function TalksContent({
  continueCursor,
  hasNextPage,
  hasPrevPage,
  talks,
}: TalksContentProps) {
  return (
    <Suspense fallback={<TalksListSkeleton />}>
      <TalksList talks={talks} />
      <Pagination
        continueCursor={continueCursor}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
      />
    </Suspense>
  );
}
