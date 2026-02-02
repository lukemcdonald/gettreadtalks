'use client';

import type { Topic } from '@/features/topics/types';

import { useSheetRoute } from '@/app/@sheet/_hooks/use-sheet-route';
import { EditTopicSheet } from '@/features/topics/components/edit-topic-sheet';

interface EditTopicSheetRouteProps {
  topic: Topic;
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
