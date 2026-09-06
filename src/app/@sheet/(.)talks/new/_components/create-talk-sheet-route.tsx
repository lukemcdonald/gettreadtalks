'use client';

import type { CollectionListItem } from '@/features/collections/types';
import type { SpeakerListItem } from '@/features/speakers/types';
import type { TopicListItem } from '@/features/topics/types';

import { useSheetRoute } from '@/app/@sheet/_hooks/use-sheet-route';
import { CreateTalkSheet } from '@/features/talks/components/create-talk-sheet';

interface CreateTalkSheetRouteProps {
  collections: CollectionListItem[];
  speakers: SpeakerListItem[];
  topics: TopicListItem[];
}

export function CreateTalkSheetRoute({
  collections,
  speakers,
  topics,
}: CreateTalkSheetRouteProps) {
  const { handleOpenChange, handleSuccess } = useSheetRoute();

  return (
    <CreateTalkSheet
      collections={collections}
      onOpenChange={handleOpenChange}
      onTalkCreated={handleSuccess}
      open
      speakers={speakers}
      topics={topics}
    />
  );
}
