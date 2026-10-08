'use client';

import type { SpeakerListItem } from '@/features/speakers/types';
import type { TalkListItem } from '@/features/talks/types';

import { useSheetRoute } from '@/app/@sheet/_hooks/use-sheet-route';
import { CreateClipSheet } from '@/features/clips/components/create-clip-sheet';

interface CreateClipSheetRouteProps {
  closeHref?: string;
  speakers: SpeakerListItem[];
  talks: TalkListItem[];
}

export function CreateClipSheetRoute({
  closeHref,
  speakers,
  talks,
}: CreateClipSheetRouteProps) {
  const { handleOpenChange, handleSuccess } = useSheetRoute(closeHref);

  return (
    <CreateClipSheet
      onClipCreated={handleSuccess}
      onOpenChange={handleOpenChange}
      open
      speakers={speakers}
      talks={talks}
    />
  );
}
