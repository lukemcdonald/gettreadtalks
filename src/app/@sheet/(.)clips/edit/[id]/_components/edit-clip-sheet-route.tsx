'use client';

import type { Clip } from '@/features/clips/types';
import type { SpeakerListItem } from '@/features/speakers/types';
import type { TalkListItem } from '@/features/talks/types';

import { useSheetRoute } from '@/app/@sheet/_hooks/use-sheet-route';
import { EditClipSheet } from '@/features/clips/components';

interface EditClipSheetRouteProps {
  clip: Clip;
  speakers: SpeakerListItem[];
  talks: TalkListItem[];
}

export function EditClipSheetRoute({ clip, speakers, talks }: EditClipSheetRouteProps) {
  const { handleOpenChange, handleSuccess } = useSheetRoute();

  return (
    <EditClipSheet
      clip={clip}
      onClipUpdated={handleSuccess}
      onOpenChange={handleOpenChange}
      open
      speakers={speakers}
      talks={talks}
    />
  );
}
