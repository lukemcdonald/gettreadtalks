'use client';

import { CreateSpeakerSheet } from '@/features/speakers/components/create-speaker-sheet';
import { useSheetRoute } from '@/hooks/use-sheet-route';

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
