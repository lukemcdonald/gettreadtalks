'use client';

import type { TalkId, TalkStudy, TalkTranscript } from '@/features/talks/types';

import { useSheetRoute } from '@/app/@sheet/_hooks/use-sheet-route';
import { EditTalkStudySheet } from '@/features/talks/components/edit-talk-study-sheet';

interface EditTalkStudySheetRouteProps {
  closeHref?: string;
  study: TalkStudy | null;
  talkId: TalkId;
  transcript: TalkTranscript | null;
}

export function EditTalkStudySheetRoute({
  closeHref,
  study,
  talkId,
  transcript,
}: EditTalkStudySheetRouteProps) {
  const { handleOpenChange, handleSuccess } = useSheetRoute(closeHref);

  return (
    <EditTalkStudySheet
      onOpenChange={handleOpenChange}
      onStudyUpdated={handleSuccess}
      open
      study={study}
      talkId={talkId}
      transcript={transcript}
    />
  );
}
