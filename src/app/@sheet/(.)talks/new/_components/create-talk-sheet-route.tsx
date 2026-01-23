'use client';

import type { CollectionListItem } from '@/features/collections/types';
import type { SpeakerListItem } from '@/features/speakers/types';

import { CreateTalkSheet } from '@/features/talks/components';
import { useSheetRoute } from '@/lib/sheets/use-sheet-route';

interface CreateTalkSheetRouteProps {
  collections: CollectionListItem[];
  speakers: SpeakerListItem[];
}

export function CreateTalkSheetRoute({ collections, speakers }: CreateTalkSheetRouteProps) {
  const { handleOpenChange, handleSuccess } = useSheetRoute();

  return (
    <CreateTalkSheet
      collections={collections}
      onOpenChange={handleOpenChange}
      onTalkCreated={handleSuccess}
      open
      speakers={speakers}
    />
  );
}
