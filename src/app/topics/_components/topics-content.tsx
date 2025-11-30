import { Suspense } from 'react';

import { TopicsList } from '@/app/topics/_components/topics-list';
import { getTopicsWithCounts } from '@/features/topics';

export async function TopicsContent() {
  const topics = await getTopicsWithCounts();

  return (
    <Suspense>
      <TopicsList topics={topics} />
    </Suspense>
  );
}
