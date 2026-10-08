'use client';

import type { Topic } from '@/features/topics/types';

import { useSheetRoute } from '@/app/@sheet/_hooks/use-sheet-route';
import { EditTopicSheet } from '@/features/topics/components/edit-topic-sheet';

interface EditTopicSheetRouteProps {
  closeHref?: string;
  topic: Topic;
}

export function EditTopicSheetRoute({
  closeHref,
  topic,
}: EditTopicSheetRouteProps) {
  const { handleOpenChange, handleSuccess } = useSheetRoute(closeHref);

  return (
    <EditTopicSheet
      onOpenChange={handleOpenChange}
      onTopicUpdated={handleSuccess}
      open
      topic={topic}
    />
  );
}
