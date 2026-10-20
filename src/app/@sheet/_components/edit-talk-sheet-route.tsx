'use client';

import type { CollectionListItem } from '@/features/collections/types';
import type { SpeakerListItem } from '@/features/speakers/types';
import type {
  TalkStudy,
  TalkTranscript,
  TalkWithTopicIds,
} from '@/features/talks/types';
import type { TopicListItem } from '@/features/topics/types';
import type { StatusPrefill } from '@/lib/entities/status-prefill';

import { useSheetRoute } from '@/app/@sheet/_hooks/use-sheet-route';
import { EditTalkSheet } from '@/features/talks/components/edit-talk-sheet';

interface EditTalkSheetRouteProps {
  closeHref?: string;
  collections: CollectionListItem[];
  speakers: SpeakerListItem[];
  statusPrefill?: StatusPrefill;
  study: TalkStudy | null;
  talk: TalkWithTopicIds;
  topics: TopicListItem[];
  transcript: TalkTranscript | null;
}

export function EditTalkSheetRoute({
  closeHref,
  collections,
  speakers,
  statusPrefill,
  study,
  talk,
  topics,
  transcript,
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
      study={study}
      talk={talk}
      topics={topics}
      transcript={transcript}
    />
  );
}
