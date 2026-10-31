'use client';

import type { TalkId } from '@/features/talks/types';

import { useQuery } from 'convex/react';
import { useState } from 'react';

import { Button, Textarea } from '@/components/ui';
import { api } from '@/convex/_generated/api';
import { useMutation } from '@/hooks';
import { formatErrorMessage } from '@/services/errors';

function TranscriptEditorError({ error }: { error: Error | null }) {
  if (!error) {
    return null;
  }

  return (
    <p className="text-destructive text-sm">{formatErrorMessage(error)}</p>
  );
}

function TranscriptEditorActions({
  draft,
  isLoading,
  onCancel,
  onSave,
  text,
  transcriptLoaded,
}: {
  draft: string | undefined;
  isLoading: boolean;
  onCancel: () => void;
  onSave: () => void;
  text: string;
  transcriptLoaded: boolean;
}) {
  const canSave = transcriptLoaded && text.trim().length > 0;

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        data-testid="cancel-transcript"
        disabled={isLoading || draft === undefined}
        onClick={onCancel}
        type="button"
        variant="outline"
      >
        Cancel
      </Button>
      <Button
        data-testid="save-transcript"
        disabled={!canSave}
        loading={isLoading}
        onClick={onSave}
        type="button"
      >
        Save
      </Button>
    </div>
  );
}

function TalkTranscriptEditorBody({
  draft,
  error,
  isLoading,
  mutateAsync,
  reset,
  setDraft,
  talkId,
  text,
  transcriptLoaded,
}: {
  draft: string | undefined;
  error: Error | null;
  isLoading: boolean;
  mutateAsync: (args: { talkId: TalkId; text: string }) => Promise<unknown>;
  reset: () => void;
  setDraft: (value: string | undefined) => void;
  talkId: TalkId;
  text: string;
  transcriptLoaded: boolean;
}) {
  function handleCancel() {
    reset();
    setDraft(undefined);
  }

  function handleSave() {
    const saved = text.trim();

    void mutateAsync({ talkId, text: saved }).then(() => {
      reset();
      setDraft(saved);
    });
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2">
      <Textarea
        aria-label="Transcript"
        className="grid min-h-0 min-w-0 flex-1 grid-cols-1 grid-rows-1 [&_[data-slot=textarea]]:max-h-[25rem] [&_[data-slot=textarea]]:min-h-[25rem] [&_[data-slot=textarea]]:min-w-0 [&_[data-slot=textarea]]:overflow-y-auto"
        data-testid="talk-transcript"
        disabled={!transcriptLoaded || isLoading}
        onChange={(event) => {
          setDraft(event.target.value);
        }}
        value={text}
      />
      <TranscriptEditorError error={error} />
      <TranscriptEditorActions
        draft={draft}
        isLoading={isLoading}
        onCancel={handleCancel}
        onSave={handleSave}
        text={text}
        transcriptLoaded={transcriptLoaded}
      />
    </div>
  );
}

export function TalkTranscriptEditor({ talkId }: { talkId: TalkId }) {
  const [draft, setDraft] = useState<string | undefined>();
  const transcript = useQuery(api.talks.getTalkTranscriptText, { talkId });
  const { error, isLoading, mutateAsync, reset } = useMutation(
    api.talks.updateTalkTranscript
  );
  const transcriptLoaded = transcript !== undefined;
  const text = draft ?? transcript?.text ?? '';

  return (
    <TalkTranscriptEditorBody
      draft={draft}
      error={error}
      isLoading={isLoading}
      mutateAsync={mutateAsync}
      reset={reset}
      setDraft={setDraft}
      talkId={talkId}
      text={text}
      transcriptLoaded={transcriptLoaded}
    />
  );
}
