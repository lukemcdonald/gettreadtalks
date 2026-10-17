'use client';

import type { CollectionListItem } from '@/features/collections/types';
import type { SpeakerListItem } from '@/features/speakers/types';
import type { TopicListItem } from '@/features/topics/types';

import { CreateTalkSheet } from '@/features/talks/components/create-talk-sheet';
import { useSheetRoute } from '@/hooks/use-sheet-route';

interface CreateTalkSheetRouteProps {
  closeHref?: string;
  collections: CollectionListItem[];
  speakers: SpeakerListItem[];
  topics: TopicListItem[];
}

export function CreateTalkSheetRoute({
  closeHref,
  collections,
  speakers,
  topics,
}: CreateTalkSheetRouteProps) {
  const { handleOpenChange, handleSuccess } = useSheetRoute(closeHref);

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
