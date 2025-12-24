import type { TalksPageSearchParams } from '@/app/talks/page';
import type { StatusType } from '@/convex/lib/validators/shared';
import type { SpeakerId } from '@/features/speakers/types';
import type { TopicId } from '@/features/topics/types';

import { Suspense } from 'react';

import { Pagination } from '@/app/talks/_components/pagination';
import { TalksListFilter } from '@/app/talks/_components/talks-list-filter';
import { getTalksWithSpeakers } from '@/features/talks';
import { TalksList, TalksListSkeleton } from '@/features/talks/components';
import { getCurrentUser } from '@/services/auth/server';
import { isAdmin } from '@/services/auth/utils';

type TalksContentProps = {
  searchParams: Awaited<TalksPageSearchParams>;
};

export async function TalksContent({ searchParams }: TalksContentProps) {
  const user = await getCurrentUser();
  const userIsAdmin = isAdmin(user);

  const {
    cursor,
    featured: featuredParam,
    search,
    speakerId,
    topicId,
    status: statusParam,
  } = searchParams;

  const featured = !!featuredParam;
  const status = userIsAdmin ? statusParam : 'published';

  const result = await getTalksWithSpeakers({
    cursor,
    featured,
    limit: 20,
    search,
    speakerId,
    status,
    topicId,
  });

  return (
    <Suspense fallback={<TalksListSkeleton />}>
      <TalksListFilter userIsAdmin={userIsAdmin} />
      <TalksList talks={result.talks} />
      <Pagination
        continueCursor={result.continueCursor}
        hasNextPage={!result.isDone}
        hasPrevPage={!!cursor}
      />
    </Suspense>
  );
}
