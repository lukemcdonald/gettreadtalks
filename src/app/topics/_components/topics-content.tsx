import { Suspense } from 'react';

import { getTopicsWithCounts } from '@/features/topics';
import { TopicsList } from '@/features/topics/components';

export async function TopicsContent() {
  const topics = await getTopicsWithCounts();

  return (
    <Suspense>
      <TopicsList topics={topics} />
    </Suspense>
  );
}
