'use client';

import type { CollectionListItem } from '@/features/collections/types';
import type { SpeakerListItem } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';

import { EditTalkSheet } from '@/features/talks/components';
import { useSheetRoute } from '@/lib/sheets/use-sheet-route';

type TalkData = Pick<
  Talk,
  | '_id'
  | 'collectionId'
  | 'collectionOrder'
  | 'description'
  | 'featured'
  | 'mediaUrl'
  | 'scripture'
  | 'speakerId'
  | 'status'
  | 'title'
>;

interface EditTalkSheetRouteProps {
  collections: CollectionListItem[];
  speakers: SpeakerListItem[];
  talk: TalkData;
}

export function EditTalkSheetRoute({ collections, speakers, talk }: EditTalkSheetRouteProps) {
  const { handleOpenChange, handleSuccess } = useSheetRoute();

  return (
    <EditTalkSheet
      collections={collections}
      onOpenChange={handleOpenChange}
      onTalkUpdated={handleSuccess}
      open
      speakers={speakers}
      talk={talk}
    />
  );
}
