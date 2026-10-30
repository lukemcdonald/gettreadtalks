'use client';

import type { TalkId } from '@/features/talks/types';

import { useQuery } from 'convex/react';
import { useState } from 'react';

import { Button, Textarea } from '@/components/ui';
import { api } from '@/convex/_generated/api';
import { useMutation } from '@/hooks';
import { formatErrorMessage } from '@/services/errors';

// fallow-ignore-next-line complexity
export function TalkTranscriptEditor({
  active,
  talkId,
}: {
  active: boolean;
  talkId: TalkId;
}) {
  const [draft, setDraft] = useState<string | undefined>();
  const transcript = useQuery(
    api.talks.getTalkTranscriptText,
    active ? { talkId } : 'skip'
  );
  const { error, isLoading, mutateAsync, reset } = useMutation(
    api.talks.updateTalkTranscript
  );
  const text = draft ?? transcript?.text ?? '';
  const isReady = transcript !== undefined;

  function handleReset() {
    reset();
    setDraft(undefined);
  }

  async function handleSave() {
    await mutateAsync({ talkId, text });
    handleReset();
  }

  if (!active) {
    return null;
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2">
      <Textarea
        aria-label="Transcript"
        className="grid min-h-0 min-w-0 flex-1 grid-cols-1 grid-rows-1 [&_[data-slot=textarea]]:min-h-60 [&_[data-slot=textarea]]:min-w-0"
        data-testid="talk-transcript"
        disabled={!isReady || isLoading}
        onChange={(event) => {
          setDraft(event.target.value);
        }}
        value={text}
      />
      {error ? (
        <p className="text-destructive text-sm">{formatErrorMessage(error)}</p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <Button
          data-testid="cancel-transcript"
          disabled={isLoading || draft === undefined}
          onClick={handleReset}
          type="button"
          variant="outline"
        >
          Cancel
        </Button>
        <Button
          data-testid="save-transcript"
          disabled={!isReady || !text.trim()}
          loading={isLoading}
          onClick={() => {
            void handleSave();
          }}
          type="button"
        >
          Save
        </Button>
      </div>
    </div>
  );
}
