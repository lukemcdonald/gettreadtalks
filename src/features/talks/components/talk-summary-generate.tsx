'use client';

import type { TalkId } from '@/features/talks/types';

import { useAction } from 'convex/react';
import { useState } from 'react';

import { Button } from '@/components/ui';
import { api } from '@/convex/_generated/api';

function getSummaryGenerateStatusText({
  error,
  hasTranscript,
  isPending,
}: {
  error: string | null;
  hasTranscript: boolean;
  isPending: boolean;
}) {
  if (isPending) {
    return 'Generating summary...';
  }

  if (error) {
    return error;
  }

  return hasTranscript ? null : 'Needs a transcript';
}

export function TalkSummaryGenerate({
  hasTranscript,
  onFlagsChange,
  talkId,
}: {
  hasTranscript: boolean;
  onFlagsChange?: (flags: string[]) => void;
  talkId: TalkId;
}) {
  const generate = useAction(api.talks.generateTalkSummary);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const statusText = getSummaryGenerateStatusText({
    error,
    hasTranscript,
    isPending,
  });

  function handleClick() {
    setError(null);
    setIsPending(true);
    onFlagsChange?.([]);

    void generate({ talkId })
      .then((result) => {
        if (result.status === 'failed') {
          setError(result.message);
          return;
        }

        onFlagsChange?.(result.flags);
      })
      .catch(() => {
        setError('Something went wrong. Please try again.');
      })
      .then(() => {
        setIsPending(false);
      });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        data-testid="generate-summary"
        disabled={!hasTranscript || isPending}
        loading={isPending}
        onClick={handleClick}
        size="sm"
        type="button"
        variant="outline"
      >
        Generate summary
      </Button>
      {statusText ? (
        <p
          aria-live="polite"
          className="text-muted-foreground text-sm"
          data-testid="generate-summary-status"
        >
          {statusText}
        </p>
      ) : null}
    </div>
  );
}
