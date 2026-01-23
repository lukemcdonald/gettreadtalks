'use client';

import { CreateSpeakerSheet } from '@/features/speakers/components';
import { useSheetRoute } from '@/lib/sheets/use-sheet-route';

export default function Page() {
  const { handleOpenChange, handleSuccess } = useSheetRoute();

  return (
    <CreateSpeakerSheet onOpenChange={handleOpenChange} onSpeakerCreated={handleSuccess} open />
  );
}
