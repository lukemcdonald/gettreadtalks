'use client';

import type { Clip } from '@/features/clips/types';
import type { SpeakerListItem } from '@/features/speakers/types';
import type { TalkListItem } from '@/features/talks/types';
import type { StatusPrefill } from '@/lib/entities/status-prefill';

import { useSheetRoute } from '@/app/@sheet/_hooks/use-sheet-route';
import { EditClipSheet } from '@/features/clips/components/edit-clip-sheet';

interface EditClipSheetRouteProps {
  clip: Clip;
  closeHref?: string;
  speakers: SpeakerListItem[];
  statusPrefill?: StatusPrefill;
  talks: TalkListItem[];
}

export function EditClipSheetRoute({
  clip,
  closeHref,
  speakers,
  statusPrefill,
  talks,
}: EditClipSheetRouteProps) {
  const { handleOpenChange, handleSuccess } = useSheetRoute(closeHref);

  return (
    <EditClipSheet
      clip={clip}
      onClipUpdated={handleSuccess}
      onOpenChange={handleOpenChange}
      open
      speakers={speakers}
      statusPrefill={statusPrefill}
      talks={talks}
    />
  );
}
