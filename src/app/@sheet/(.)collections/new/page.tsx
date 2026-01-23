'use client';

import { SheetScrollLock } from '@/app/@sheet/_components/sheet-scroll-lock';
import { useSheetRoute } from '@/app/@sheet/_hooks/use-sheet-route';
import { CreateCollectionSheet } from '@/features/collections/components';

export default function Page() {
  const { handleOpenChange, handleSuccess } = useSheetRoute();

  return (
    <>
      <SheetScrollLock />
      <CreateCollectionSheet
        onCollectionCreated={handleSuccess}
        onOpenChange={handleOpenChange}
        open
      />
    </>
  );
}
