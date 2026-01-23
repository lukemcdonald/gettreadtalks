'use client';

import type { SpeakerListItem } from '@/features/speakers/types';
import type { TalkListItem } from '@/features/talks/types';

import { CreateClipSheet } from '@/features/clips/components';
import { useSheetRoute } from '@/lib/sheets/use-sheet-route';

interface CreateClipSheetRouteProps {
  speakers: SpeakerListItem[];
  talks: TalkListItem[];
}

export function CreateClipSheetRoute({ speakers, talks }: CreateClipSheetRouteProps) {
  const { handleOpenChange, handleSuccess } = useSheetRoute();

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
