'use client';

import type { Collection } from '@/features/collections/types';

import { useSheetRoute } from '@/app/@sheet/_hooks/use-sheet-route';
import { EditCollectionSheet } from '@/features/collections/components/edit-collection-sheet';

interface EditCollectionSheetRouteProps {
  collection: Collection;
}

export function EditCollectionSheetRoute({ collection }: EditCollectionSheetRouteProps) {
  const { handleOpenChange, handleSuccess } = useSheetRoute();

  return (
    <EditCollectionSheet
      collection={collection}
      onCollectionUpdated={handleSuccess}
      onOpenChange={handleOpenChange}
      open
    />
  );
}
