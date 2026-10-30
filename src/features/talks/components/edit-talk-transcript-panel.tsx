'use client';

import type { TalkId } from '@/features/talks/types';

import { useQuery } from 'convex/react';

import { Button, FormSheetBody } from '@/components/ui';
import { api } from '@/convex/_generated/api';
import { TalkTranscriptEditor } from '@/features/talks/components/talk-transcript-editor';
import { TalkTranscriptFetch } from '@/features/talks/components/talk-transcript-fetch';
import { hasTalkTranscriptSource } from '@/features/talks/utils';

export function EditTalkTranscriptPanel({
  active,
  mediaUrl,
  onClose,
  talkId,
}: {
  active: boolean;
  mediaUrl: string;
  onClose: () => void;
  talkId: TalkId;
}) {
  const transcript = useQuery(
    api.talks.getTalkTranscript,
    active ? { talkId } : 'skip'
  );
  const hasTranscript = Boolean(transcript);

  return (
    <FormSheetBody
      footer={
        <Button onClick={onClose} type="button" variant="outline">
          Close
        </Button>
      }
      scrollable
    >
      <div
        className="flex min-h-0 flex-1 flex-col gap-4"
        data-testid="edit-talk-transcript-panel"
      >
        <p className="text-muted-foreground text-sm">
          The transcript is private and only used to generate the summary and
          study.
        </p>
        <TalkTranscriptFetch
          hasTranscript={hasTranscript}
          mediaUrl={mediaUrl}
          showLabel={false}
          talkId={talkId}
        />
        {hasTalkTranscriptSource(mediaUrl) ? (
          <TalkTranscriptEditor active={active} talkId={talkId} />
        ) : null}
      </div>
    </FormSheetBody>
  );
}
