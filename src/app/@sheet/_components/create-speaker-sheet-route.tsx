'use client';

import { useSheetRoute } from '@/app/@sheet/_hooks/use-sheet-route';
import { CreateSpeakerSheet } from '@/features/speakers/components/create-speaker-sheet';

interface CreateSpeakerSheetRouteProps {
  closeHref?: string;
}

export function CreateSpeakerSheetRoute({
  closeHref,
}: CreateSpeakerSheetRouteProps) {
  const { handleOpenChange, handleSuccess } = useSheetRoute(closeHref);

  return (
    <CreateSpeakerSheet
      onOpenChange={handleOpenChange}
      onSpeakerCreated={handleSuccess}
      open
    />
  );
}
