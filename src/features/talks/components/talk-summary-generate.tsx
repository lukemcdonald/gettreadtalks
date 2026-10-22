'use client';

import type { TalkId } from '@/features/talks/types';

import { useAction } from 'convex/react';
import { useState } from 'react';

import { Button } from '@/components/ui';
import { api } from '@/convex/_generated/api';

function getSummaryGenerateStatusText({
  error,
  isPending,
}: {
  error: string | null;
  isPending: boolean;
}) {
  if (isPending) {
    return 'Generating summary...';
  }

  return error;
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
    isPending,
  });

  if (!hasTranscript) {
    return null;
  }

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
    <div className="space-y-2">
      <Button
        data-testid="generate-summary"
        disabled={isPending}
        loading={isPending}
        onClick={handleClick}
        size="sm"
        type="button"
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
