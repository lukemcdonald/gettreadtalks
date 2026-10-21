'use client';

import type {
  TalkId,
  TalkTranscript,
  TalkTranscriptFetch as TranscriptFetch,
} from '@/features/talks/types';

import { useQuery } from 'convex/react';
import { useEffect, useState } from 'react';

import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
  Button,
  Textarea,
} from '@/components/ui';
import { api } from '@/convex/_generated/api';
import { useFetchTalkTranscript } from '@/features/talks/hooks/use-fetch-talk-transcript';
import {
  formatTranscriptFetchFailure,
  formatTranscriptFetchSuccess,
  isTranscriptFetchCoolingDown,
} from '@/features/talks/utils';

// fallow-ignore-next-line complexity
function getTranscriptFetchStatusText({
  fetch,
  transcript,
}: {
  fetch: TranscriptFetch | null;
  transcript: TalkTranscript | null;
}) {
  if (fetch?.status === 'pending') {
    return 'Fetching transcript...';
  }

  if (fetch?.status === 'failed') {
    return formatTranscriptFetchFailure(fetch);
  }

  if (transcript?.text) {
    return formatTranscriptFetchSuccess(transcript);
  }

  return null;
}

function RefetchTranscriptDialog({
  onConfirm,
  onOpenChange,
  open,
}: {
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}) {
  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogPopup>
        <AlertDialogHeader>
          <AlertDialogTitle>Fetch this transcript again?</AlertDialogTitle>
          <AlertDialogDescription>
            This replaces the saved transcript. Published or hand-edited studies
            are left as they are.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose render={<Button variant="outline" />}>
            Cancel
          </AlertDialogClose>
          <AlertDialogClose onClick={onConfirm} render={<Button />}>
            Re-fetch
          </AlertDialogClose>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  );
}

// fallow-ignore-next-line complexity
function TalkTranscriptFetchStatus({
  disabled,
  fetch,
  onFetch,
  transcript,
}: {
  disabled: boolean;
  fetch: TranscriptFetch | null;
  onFetch: (confirmRefetch: boolean) => void;
  transcript: TalkTranscript | null;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const hasTranscript = Boolean(transcript?.text);
  const coolingDown = isTranscriptFetchCoolingDown(fetch, now);
  const isPending = disabled || fetch?.status === 'pending' || coolingDown;
  const statusText = getTranscriptFetchStatusText({ fetch, transcript });

  useEffect(() => {
    if (!fetch?.retryAfter || fetch.retryAfter <= Date.now()) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setNow(Date.now());
    }, fetch.retryAfter - Date.now());

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [fetch?.retryAfter]);

  function handleClick() {
    if (hasTranscript) {
      setConfirmOpen(true);
      return;
    }

    onFetch(false);
  }

  function handleConfirm() {
    setConfirmOpen(false);
    onFetch(true);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2">
        <Button
          disabled={isPending}
          onClick={handleClick}
          size="sm"
          type="button"
        >
          {hasTranscript ? 'Re-fetch' : 'Get transcript'}
        </Button>
        {statusText ? (
          <p aria-live="polite" className="text-muted-foreground text-sm">
            {statusText}
          </p>
        ) : null}
      </div>
      {transcript?.text ? (
        <Textarea readOnly rows={8} value={transcript.text} />
      ) : null}
      <RefetchTranscriptDialog
        onConfirm={handleConfirm}
        onOpenChange={setConfirmOpen}
        open={confirmOpen}
      />
    </div>
  );
}

export function TalkTranscriptFetch({
  talkId,
  transcript,
}: {
  talkId: TalkId;
  transcript: TalkTranscript | null;
}) {
  const liveFetch = useQuery(api.talks.getTalkTranscriptFetch, { talkId });
  const liveTranscript = useQuery(api.talks.getTalkTranscript, { talkId });
  const { isLoading, mutate } = useFetchTalkTranscript();

  return (
    <TalkTranscriptFetchStatus
      disabled={isLoading}
      fetch={liveFetch ?? null}
      onFetch={(confirmRefetch) => {
        mutate({ confirmRefetch, talkId });
      }}
      transcript={liveTranscript === undefined ? transcript : liveTranscript}
    />
  );
}
