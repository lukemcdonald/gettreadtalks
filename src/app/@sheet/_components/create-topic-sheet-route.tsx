'use client';

import { useSheetRoute } from '@/app/@sheet/_hooks/use-sheet-route';
import { CreateTopicSheet } from '@/features/topics/components/create-topic-sheet';

interface CreateTopicSheetRouteProps {
  closeHref?: string;
}

export function CreateTopicSheetRoute({
  closeHref,
}: CreateTopicSheetRouteProps) {
  const { handleOpenChange, handleSuccess } = useSheetRoute(closeHref);

  return (
    <CreateTopicSheet
      onOpenChange={handleOpenChange}
      onTopicCreated={handleSuccess}
      open
    />
  );
}
