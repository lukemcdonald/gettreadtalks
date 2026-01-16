import type { TalkWithSpeaker } from '@/features/talks/types';

import { Pagination } from '@/components/pagination';
import { Empty, EmptyDescription } from '@/components/ui';
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
  if (talks.length === 0) {
    return (
      <Empty>
        <EmptyDescription>No talks in this topic yet</EmptyDescription>
      </Empty>
    );
  }

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
