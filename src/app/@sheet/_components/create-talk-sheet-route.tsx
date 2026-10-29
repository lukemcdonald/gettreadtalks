'use client';

import type { CollectionListItem } from '@/features/collections/types';
import type { SpeakerListItem } from '@/features/speakers/types';
import type { TopicListItem } from '@/features/topics/types';

import { useRouter } from 'next/navigation';

import { useSheetRoute } from '@/app/@sheet/_hooks/use-sheet-route';
import { CreateTalkSheet } from '@/features/talks/components/create-talk-sheet';
import {
  buildTalkEditPath,
  markCreatedTalkTranscriptFetch,
} from '@/features/talks/utils';

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
  const router = useRouter();
  const { handleOpenChange } = useSheetRoute(closeHref);

  return (
    <CreateTalkSheet
      collections={collections}
      onOpenChange={handleOpenChange}
      onTalkCreated={(talkId) => {
        markCreatedTalkTranscriptFetch(talkId);
        router.replace(buildTalkEditPath(talkId));
      }}
      open
      speakers={speakers}
      topics={topics}
    />
  );
}
