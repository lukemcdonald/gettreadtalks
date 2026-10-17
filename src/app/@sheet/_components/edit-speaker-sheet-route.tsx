'use client';

import type { Speaker } from '@/features/speakers/types';

import { EditSpeakerSheet } from '@/features/speakers/components/edit-speaker-sheet';
import { useSheetRoute } from '@/hooks/use-sheet-route';

interface EditSpeakerSheetRouteProps {
  closeHref?: string;
  speaker: Speaker;
}

export function EditSpeakerSheetRoute({
  closeHref,
  speaker,
}: EditSpeakerSheetRouteProps) {
  const { handleOpenChange, handleSuccess } = useSheetRoute(closeHref);

  return (
    <EditSpeakerSheet
      onOpenChange={handleOpenChange}
      onSpeakerUpdated={handleSuccess}
      open
      speaker={speaker}
    />
  );
}
