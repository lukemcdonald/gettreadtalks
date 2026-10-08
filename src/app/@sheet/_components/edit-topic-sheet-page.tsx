import type { TopicId } from '@/features/topics/types';
import type { Route } from 'next';

import { redirect } from 'next/navigation';

import { EditTopicSheetRoute } from '@/app/@sheet/_components/edit-topic-sheet-route';
import { getTopic } from '@/features/topics/queries/get-topic';
import {
  ADMIN_LIST_PATHS,
  getAdminLoginRedirect,
  getEntityEditPath,
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
    getAdminLoginRedirect(getEntityEditPath('topics', topicId)) as Route
  );

  const topic = await getTopic(topicId);

  if (!topic) {
    redirect(ADMIN_LIST_PATHS.topics);
  }

  return <EditTopicSheetRoute closeHref={closeHref} topic={topic} />;
}
