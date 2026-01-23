'use client';

import type { Topic } from '@/features/topics/types';

import { EditTopicSheet } from '@/features/topics/components';
import { useSheetRoute } from '@/lib/sheets/use-sheet-route';

type TopicData = Pick<Topic, '_id' | 'title'>;

interface EditTopicSheetRouteProps {
  topic: TopicData;
}

export function EditTopicSheetRoute({ topic }: EditTopicSheetRouteProps) {
  const { handleOpenChange, handleSuccess } = useSheetRoute();

  return (
    <EditTopicSheet
      onOpenChange={handleOpenChange}
      onTopicUpdated={handleSuccess}
      open
      topic={topic}
    />
  );
}
