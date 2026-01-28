'use client';

import { useSheetRoute } from '@/app/@sheet/_hooks/use-sheet-route';
import { CreateCollectionSheet } from '@/features/collections/components/create-collection-sheet';

export default function Page() {
  const { handleOpenChange, handleSuccess } = useSheetRoute();

  return (
    <CreateCollectionSheet
      onCollectionCreated={handleSuccess}
      onOpenChange={handleOpenChange}
      open
    />
  );
}
