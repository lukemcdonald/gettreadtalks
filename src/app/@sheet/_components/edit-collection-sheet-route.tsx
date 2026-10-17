'use client';

import type { Collection } from '@/features/collections/types';

import { EditCollectionSheet } from '@/features/collections/components/edit-collection-sheet';
import { useSheetRoute } from '@/hooks/use-sheet-route';

interface EditCollectionSheetRouteProps {
  closeHref?: string;
  collection: Collection;
}

export function EditCollectionSheetRoute({
  closeHref,
  collection,
}: EditCollectionSheetRouteProps) {
  const { handleOpenChange, handleSuccess } = useSheetRoute(closeHref);

  return (
    <EditCollectionSheet
      collection={collection}
      onCollectionUpdated={handleSuccess}
      onOpenChange={handleOpenChange}
      open
    />
  );
}
