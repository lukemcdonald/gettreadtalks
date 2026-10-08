import type { TopicId } from '@/features/topics/types';

import { EditTopicSheetPage } from '@/app/@sheet/_components/edit-topic-sheet-page';

interface PageProps {
  params: Promise<{ topicId: TopicId }>;
}

export default function Page({ params }: PageProps) {
  return <EditTopicSheetPage params={params} />;
}
