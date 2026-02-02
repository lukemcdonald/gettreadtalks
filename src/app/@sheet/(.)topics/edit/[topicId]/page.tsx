import type { TopicId } from '@/features/topics/types';

import { redirect } from 'next/navigation';

import { getTopic } from '@/features/topics/queries/get-topic';
import { EditTopicSheetRoute } from './_components/edit-topic-sheet-route';

interface PageProps {
  params: Promise<{ topicId: TopicId }>;
}

export default async function Page({ params }: PageProps) {
  const { topicId } = await params;
  const topic = await getTopic(topicId);

  if (!topic) {
    redirect('/topics');
  }

  return <EditTopicSheetRoute topic={topic} />;
}
