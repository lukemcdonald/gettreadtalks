'use client';

import type { Collection } from '@/features/collections/types';

import { EditCollectionSheet } from '@/features/collections/components';
import { useSheetRoute } from '@/lib/sheets/use-sheet-route';

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
