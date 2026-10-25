'use client';

import type { TalkId } from '@/features/talks/types';

import { useQuery } from 'convex/react';
import { useState } from 'react';

import {
  Button,
  Dialog,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
  Textarea,
} from '@/components/ui';
import { api } from '@/convex/_generated/api';
import { useMutation } from '@/hooks';
import { formatErrorMessage } from '@/services/errors';

function TalkTranscriptDialogBody({
  error,
  isLoading,
  isReady,
  onDraftChange,
  onSave,
  text,
}: {
  error: Error | null;
  isLoading: boolean;
  isReady: boolean;
  onDraftChange: (value: string) => void;
  onSave: () => void;
  text: string;
}) {
  return (
    <DialogPopup className="h-dvh max-w-7xl">
      <DialogHeader>
        <DialogTitle>Transcript</DialogTitle>
      </DialogHeader>
      <DialogPanel className="min-h-0 flex-1">
        <Textarea
          aria-label="Transcript"
          className="min-h-48"
          data-testid="talk-transcript"
          disabled={!isReady || isLoading}
          onChange={(event) => {
            onDraftChange(event.target.value);
          }}
          value={text}
        />
      </DialogPanel>
      {error ? (
        <p className="text-destructive px-6 text-sm">
          {formatErrorMessage(error)}
        </p>
      ) : null}
      <DialogFooter>
        <DialogClose disabled={isLoading} render={<Button variant="outline" />}>
          Cancel
        </DialogClose>
        <Button
          data-testid="save-transcript"
          disabled={!isReady || !text.trim()}
          loading={isLoading}
          onClick={onSave}
        >
          Save
        </Button>
      </DialogFooter>
    </DialogPopup>
  );
}

// fallow-ignore-next-line complexity
export function TalkTranscriptDialog({ talkId }: { talkId: TalkId }) {
  const [draft, setDraft] = useState<string | undefined>();
  const [open, setOpen] = useState(false);
  const transcript = useQuery(
    api.talks.getTalkTranscriptText,
    open ? { talkId } : 'skip'
  );
  const { error, isLoading, mutateAsync, reset } = useMutation(
    api.talks.updateTalkTranscript
  );
  const text = draft ?? transcript?.text ?? '';

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (nextOpen) {
      return;
    }

    reset();
    setDraft(undefined);
  }

  async function handleSave() {
    await mutateAsync({ talkId, text });
    handleOpenChange(false);
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogTrigger
        render={
          <Button
            data-testid="view-transcript"
            size="sm"
            type="button"
            variant="outline"
          />
        }
      >
        View transcript
      </DialogTrigger>
      <TalkTranscriptDialogBody
        error={error}
        isLoading={isLoading}
        isReady={transcript !== undefined}
        onDraftChange={setDraft}
        onSave={() => {
          void handleSave();
        }}
        text={text}
      />
    </Dialog>
  );
}
