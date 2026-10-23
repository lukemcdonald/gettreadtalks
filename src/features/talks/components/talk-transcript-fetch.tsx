'use client';

import type {
  TalkId,
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
} from '@/components/ui';
import { api } from '@/convex/_generated/api';
import { watchTranscriptFetch } from '@/features/talks/components/transcript-fetch-toasts';
import {
  formatTranscriptFetchFailure,
  isTranscriptFetchCoolingDown,
} from '@/features/talks/utils';
import { useMutation } from '@/hooks';

// fallow-ignore-next-line complexity
function getTranscriptFetchStatusText(
  fetch: TranscriptFetch | null,
  hasTranscript: boolean
) {
  if (fetch?.status === 'pending') {
    return 'Fetching transcript...';
  }

  if (fetch?.status === 'failed') {
    return formatTranscriptFetchFailure(fetch);
  }

  return hasTranscript ? 'Transcript saved' : null;
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
export function TalkTranscriptFetch({
  hasTranscript,
  talkId,
}: {
  hasTranscript: boolean;
  talkId: TalkId;
}) {
  const liveFetch = useQuery(api.talks.getTalkTranscriptFetch, { talkId });
  const { isLoading, mutate } = useMutation(
    api.talks.createTalkTranscriptFetch,
    {
      onSuccess: (runId) => {
        if (typeof runId !== 'string') {
          return;
        }

        watchTranscriptFetch({
          runId,
          talkId,
        });
      },
    }
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const fetch = liveFetch ?? null;
  const saved = hasTranscript || fetch?.status === 'success';
  const coolingDown = isTranscriptFetchCoolingDown(fetch, now);
  const disabled = isLoading || fetch?.status === 'pending' || coolingDown;
  const statusText = getTranscriptFetchStatusText(fetch, saved);

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
    if (saved) {
      setConfirmOpen(true);
      return;
    }

    mutate({ confirmRefetch: false, talkId });
  }

  return (
    <div className="space-y-2">
      <Button disabled={disabled} onClick={handleClick} size="sm" type="button">
        {saved ? 'Re-fetch' : 'Get transcript'}
      </Button>
      {statusText ? (
        <p aria-live="polite" className="text-muted-foreground text-sm">
          {statusText}
        </p>
      ) : null}
      <RefetchTranscriptDialog
        onConfirm={() => {
          setConfirmOpen(false);
          mutate({ confirmRefetch: true, talkId });
        }}
        onOpenChange={setConfirmOpen}
        open={confirmOpen}
      />
    </div>
  );
}
