'use client';

import { useSheetRoute } from '@/app/@sheet/_hooks/use-sheet-route';
import { CreateCollectionSheet } from '@/features/collections/components/create-collection-sheet';

interface CreateCollectionSheetRouteProps {
  closeHref?: string;
}

export function CreateCollectionSheetRoute({
  closeHref,
}: CreateCollectionSheetRouteProps) {
  const { handleOpenChange, handleSuccess } = useSheetRoute(closeHref);

  return (
    <CreateCollectionSheet
      onCollectionCreated={handleSuccess}
      onOpenChange={handleOpenChange}
      open
    />
  );
}
