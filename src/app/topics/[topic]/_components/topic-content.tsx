import type { TalkWithSpeaker } from '@/features/talks/types';

import { Pagination } from '@/components/pagination';
import { TalksList } from '@/features/talks/components';

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
        itemCount={talks.length}
      />
    </>
  );
}
