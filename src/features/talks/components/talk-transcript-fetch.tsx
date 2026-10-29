'use client';

import type {
  TalkId,
  TalkTranscriptFetch as TranscriptFetch,
} from '@/features/talks/types';
import type { ReactNode } from 'react';

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
  Field,
  FieldLabel,
} from '@/components/ui';
import { api } from '@/convex/_generated/api';
import {
  formatTranscriptFetchFailure,
  hasTalkTranscriptSource,
  isTranscriptFetchCoolingDown,
} from '@/features/talks/utils';
import { useMutation } from '@/hooks';

// fallow-ignore-next-line complexity
function getTranscriptFetchStatusText(
  fetch: TranscriptFetch | null,
  hasTranscript: boolean
) {
  if (fetch?.status === 'pending') {
    return 'Fetching...';
  }

  if (fetch?.status === 'failed') {
    const detail = formatTranscriptFetchFailure(fetch);
    return detail ? `Failed. ${detail}` : 'Failed';
  }

  return hasTranscript ? 'Saved' : 'None';
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
            This replaces the saved transcript, including any edits. Published
            or hand-edited studies are left as they are.
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
function TalkTranscriptFetchControls({
  children,
  hasTranscript,
  talkId,
}: {
  children?: ReactNode;
  hasTranscript: boolean;
  talkId: TalkId;
}) {
  const liveFetch = useQuery(api.talks.getTalkTranscriptFetch, { talkId });
  const { isLoading, mutate } = useMutation(
    api.talks.createTalkTranscriptFetch
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

  function handleGet() {
    mutate({ confirmRefetch: false, talkId });
  }

  function handleRefetch() {
    setConfirmOpen(true);
  }

  return (
    <Field>
      <FieldLabel>Transcript</FieldLabel>
      <div className="flex w-full flex-wrap items-center gap-2">
        <p aria-live="polite" className="text-muted-foreground text-sm">
          {statusText}
        </p>
        {saved ? (
          children
        ) : (
          <Button
            disabled={disabled}
            onClick={handleGet}
            size="sm"
            type="button"
            variant="outline"
          >
            Get
          </Button>
        )}
        {saved ? (
          <Button
            disabled={disabled}
            onClick={handleRefetch}
            size="sm"
            type="button"
            variant="ghost"
          >
            Re-fetch
          </Button>
        ) : null}
      </div>
      <RefetchTranscriptDialog
        onConfirm={() => {
          setConfirmOpen(false);
          mutate({ confirmRefetch: true, talkId });
        }}
        onOpenChange={setConfirmOpen}
        open={confirmOpen}
      />
    </Field>
  );
}

export function TalkTranscriptFetch({
  children,
  hasTranscript,
  mediaUrl,
  talkId,
}: {
  children?: ReactNode;
  hasTranscript: boolean;
  mediaUrl: string;
  talkId: TalkId;
}) {
  if (!hasTalkTranscriptSource(mediaUrl)) {
    return (
      <Field>
        <FieldLabel>Transcript</FieldLabel>
        <p className="text-muted-foreground text-sm">
          No transcript source for this media.
        </p>
      </Field>
    );
  }

  return (
    <TalkTranscriptFetchControls hasTranscript={hasTranscript} talkId={talkId}>
      {children}
    </TalkTranscriptFetchControls>
  );
}
