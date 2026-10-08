import type { TopicId } from '@/features/topics/types';

import { redirect } from 'next/navigation';

import { EditTopicSheetRoute } from '@/app/@sheet/_components/edit-topic-sheet-route';
import { getTopic } from '@/features/topics/queries/get-topic';
import { ADMIN_LIST_PATHS } from '@/lib/entities/paths';

interface EditTopicSheetPageProps {
  closeHref?: string;
  params: Promise<{ topicId: TopicId }>;
}

export async function EditTopicSheetPage({
  closeHref,
  params,
}: EditTopicSheetPageProps) {
  const { topicId } = await params;
  const topic = await getTopic(topicId);

  if (!topic) {
    redirect(ADMIN_LIST_PATHS.topics);
  }

  return <EditTopicSheetRoute closeHref={closeHref} topic={topic} />;
}
