'use client';

import { SheetScrollLock } from '@/app/@sheet/_components/sheet-scroll-lock';
import { useSheetRoute } from '@/app/@sheet/_hooks/use-sheet-route';
import { CreateSpeakerSheet } from '@/features/speakers/components';

export default function Page() {
  const { handleOpenChange, handleSuccess } = useSheetRoute();

  return (
    <>
      <SheetScrollLock />
      <CreateSpeakerSheet onOpenChange={handleOpenChange} onSpeakerCreated={handleSuccess} open />
    </>
  );
}
