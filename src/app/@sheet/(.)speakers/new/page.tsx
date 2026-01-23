'use client';

import { useSheetRoute } from '@/app/@sheet/_hooks/use-sheet-route';
import { CreateSpeakerSheet } from '@/features/speakers/components';

export default function Page() {
  const { handleOpenChange, handleSuccess } = useSheetRoute();

  return (
    <CreateSpeakerSheet onOpenChange={handleOpenChange} onSpeakerCreated={handleSuccess} open />
  );
}
