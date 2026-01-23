'use client';

import { SheetScrollLock } from '@/app/@sheet/_components/sheet-scroll-lock';
import { useSheetRoute } from '@/app/@sheet/_hooks/use-sheet-route';
import { CreateTopicSheet } from '@/features/topics/components';

export default function Page() {
  const { handleOpenChange, handleSuccess } = useSheetRoute();

  return (
    <>
      <SheetScrollLock />
      <CreateTopicSheet onOpenChange={handleOpenChange} onTopicCreated={handleSuccess} open />
    </>
  );
}
