import type { TopicId } from '@/features/topics/types';

import { redirect } from 'next/navigation';

import { getTopicForEdit } from '@/lib/sheets/queries';
import { EditTopicSheetRoute } from './_components/edit-topic-sheet-route';

interface PageProps {
  params: Promise<{ id: TopicId }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const topic = await getTopicForEdit(id);

  if (!topic) {
    redirect('/topics');
  }

  return <EditTopicSheetRoute topic={topic} />;
}
