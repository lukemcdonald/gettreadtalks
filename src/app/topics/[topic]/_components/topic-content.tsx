import type { Speaker } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { Pagination } from '@/app/talks/_components/pagination';
import { TalksList } from '@/features/talks/components';

type TalkWithSpeaker = Talk & { speaker: Speaker | null };
type TopicContentProps = {
  continueCursor: string;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  talks: TalkWithSpeaker[];
};

export function TopicContent({
  continueCursor,
  hasNextPage,
  hasPrevPage,
  talks,
}: TopicContentProps) {
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
