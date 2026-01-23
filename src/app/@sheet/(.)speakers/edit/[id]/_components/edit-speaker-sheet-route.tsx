'use client';

import type { Speaker } from '@/features/speakers/types';

import { useSheetRoute } from '@/app/@sheet/_hooks/use-sheet-route';
import { EditSpeakerSheet } from '@/features/speakers/components';

interface EditSpeakerSheetRouteProps {
  speaker: Speaker;
}

export function EditSpeakerSheetRoute({ speaker }: EditSpeakerSheetRouteProps) {
  const { handleOpenChange, handleSuccess } = useSheetRoute();

  return (
    <EditSpeakerSheet
      onOpenChange={handleOpenChange}
      onSpeakerUpdated={handleSuccess}
      open
      speaker={speaker}
    />
  );
}
