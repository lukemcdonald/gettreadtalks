'use client';

import type { Collection } from '@/features/collections/types';

import { useSheetRoute } from '@/app/@sheet/_hooks/use-sheet-route';
import { EditCollectionSheet } from '@/features/collections/components/edit-collection-sheet';

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
