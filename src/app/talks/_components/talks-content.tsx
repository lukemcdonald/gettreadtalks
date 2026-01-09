import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { Pagination } from '@/components/pagination';
import { TalksList } from '@/features/talks/components';

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
    <>
      <TalksList talks={talks} />
      <Pagination
        continueCursor={continueCursor}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
      />
    </>
  );
}
