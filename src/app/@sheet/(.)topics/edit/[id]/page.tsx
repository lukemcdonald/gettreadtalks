import type { TopicId } from '@/features/topics/types';

import { redirect } from 'next/navigation';

import { SheetScrollLock } from '@/app/@sheet/_components/sheet-scroll-lock';
import { getTopic } from '@/features/topics/queries';
import { EditTopicSheetRoute } from './_components/edit-topic-sheet-route';

interface PageProps {
  params: Promise<{ id: TopicId }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const topic = await getTopic(id);

  if (!topic) {
    redirect('/topics');
  }

  return (
    <>
      <SheetScrollLock />
      <EditTopicSheetRoute topic={topic} />
    </>
  );
}
