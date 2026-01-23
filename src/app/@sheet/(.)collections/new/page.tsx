'use client';

import { CreateCollectionSheet } from '@/features/collections/components';
import { useSheetRoute } from '@/lib/sheets/use-sheet-route';

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
