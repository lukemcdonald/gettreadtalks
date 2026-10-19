import type { TopicId } from '@/features/topics/types';
import type { Route } from 'next';

import { redirect } from 'next/navigation';

import { EditTopicSheetRoute } from '@/app/@sheet/_components/edit-topic-sheet-route';
import { loadTopic } from '@/features/topics/queries/load-topic';
import {
  ADMIN_LIST_PATHS,
  buildEntityEditPath,
  getLoginRedirect,
} from '@/lib/entities/paths';
import { requireAdminUser } from '@/services/auth/server';

interface EditTopicSheetPageProps {
  closeHref?: string;
  params: Promise<{ topicId: TopicId }>;
}

export async function EditTopicSheetPage({
  closeHref,
  params,
}: EditTopicSheetPageProps) {
  const { topicId } = await params;

  await requireAdminUser(
    getLoginRedirect(buildEntityEditPath('topics', topicId)) as Route
  );

  const topic = await loadTopic(topicId);

  if (!topic) {
    redirect(ADMIN_LIST_PATHS.topics);
  }

  return <EditTopicSheetRoute closeHref={closeHref} topic={topic} />;
}
