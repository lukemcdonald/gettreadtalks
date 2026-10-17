'use client';

import type { Topic } from '@/features/topics/types';

import { EditTopicSheet } from '@/features/topics/components/edit-topic-sheet';
import { useSheetRoute } from '@/hooks/use-sheet-route';

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
