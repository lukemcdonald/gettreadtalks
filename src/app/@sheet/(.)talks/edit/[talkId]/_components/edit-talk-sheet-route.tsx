'use client';

import type { CollectionListItem } from '@/features/collections/types';
import type { SpeakerListItem } from '@/features/speakers/types';
import type { Talk } from '@/features/talks/types';
import type { TopicId, TopicListItem } from '@/features/topics/types';

import { useSheetRoute } from '@/app/@sheet/_hooks/use-sheet-route';
import { EditTalkSheet } from '@/features/talks/components/edit-talk-sheet';

interface EditTalkSheetRouteProps {
  collections: CollectionListItem[];
  speakers: SpeakerListItem[];
  talk: Talk;
  topicIds: TopicId[];
  topics: TopicListItem[];
}

export function EditTalkSheetRoute({
  collections,
  speakers,
  talk,
  topicIds,
  topics,
}: EditTalkSheetRouteProps) {
  const { handleOpenChange, handleSuccess } = useSheetRoute();

  return (
    <EditTalkSheet
      collections={collections}
      onOpenChange={handleOpenChange}
      onTalkUpdated={handleSuccess}
      open
      speakers={speakers}
      talk={talk}
      topicIds={topicIds}
      topics={topics}
    />
  );
}
