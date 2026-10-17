'use client';

import type { CollectionListItem } from '@/features/collections/types';
import type { SpeakerListItem } from '@/features/speakers/types';
import type { TalkWithTopicIds } from '@/features/talks/types';
import type { TopicListItem } from '@/features/topics/types';
import type { StatusPrefill } from '@/lib/entities/status-prefill';

import { useSheetRoute } from '@/app/@sheet/_hooks/use-sheet-route';
import { EditTalkSheet } from '@/features/talks/components/edit-talk-sheet';

interface EditTalkSheetRouteProps {
  closeHref?: string;
  collections: CollectionListItem[];
  speakers: SpeakerListItem[];
  statusPrefill?: StatusPrefill;
  talk: TalkWithTopicIds;
  topics: TopicListItem[];
}

export function EditTalkSheetRoute({
  closeHref,
  collections,
  speakers,
  statusPrefill,
  talk,
  topics,
}: EditTalkSheetRouteProps) {
  const { handleOpenChange, handleSuccess } = useSheetRoute(closeHref);

  return (
    <EditTalkSheet
      collections={collections}
      onOpenChange={handleOpenChange}
      onTalkUpdated={handleSuccess}
      open
      speakers={speakers}
      statusPrefill={statusPrefill}
      talk={talk}
      topics={topics}
    />
  );
}
