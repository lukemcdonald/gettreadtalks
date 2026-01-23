'use client';

import type { Speaker } from '@/features/speakers/types';

import { EditSpeakerSheet } from '@/features/speakers/components';
import { useSheetRoute } from '@/lib/sheets/use-sheet-route';

type SpeakerData = Pick<
  Speaker,
  | '_id'
  | 'description'
  | 'featured'
  | 'firstName'
  | 'imageUrl'
  | 'lastName'
  | 'ministry'
  | 'role'
  | 'websiteUrl'
>;

interface EditSpeakerSheetRouteProps {
  speaker: SpeakerData;
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
