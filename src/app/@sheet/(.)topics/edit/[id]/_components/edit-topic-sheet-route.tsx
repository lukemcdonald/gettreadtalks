'use client';

import type { Topic } from '@/features/topics/types';

import { EditTopicSheet } from '@/features/topics/components';
import { useSheetRoute } from '@/lib/sheets/use-sheet-route';

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
