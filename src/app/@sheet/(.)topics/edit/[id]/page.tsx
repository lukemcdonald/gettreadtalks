import type { TopicId } from '@/features/topics/types';

import { redirect } from 'next/navigation';

import { getTopicForEdit } from '@/lib/sheets/queries';
import { EditTopicSheetRoute } from './_components/edit-topic-sheet-route';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const topic = await getTopicForEdit(id as TopicId);

  if (!topic) {
    redirect('/topics');
  }

  return <EditTopicSheetRoute topic={topic} />;
}
