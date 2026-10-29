'use client';

import type { TalkId } from '@/features/talks/types';

import { useAction } from 'convex/react';
import { useState } from 'react';

import { Button } from '@/components/ui';
import { api } from '@/convex/_generated/api';

function getStudyGenerateStatusText({
  error,
  hasTranscript,
  isPending,
}: {
  error: string | null;
  hasTranscript: boolean;
  isPending: boolean;
}) {
  if (isPending) {
    return 'Generating study...';
  }

  if (error) {
    return error;
  }

  return hasTranscript ? null : 'Needs a transcript';
}

export function TalkStudyGenerate({
  hasTranscript,
  talkId,
}: {
  hasTranscript: boolean;
  talkId: TalkId;
}) {
  const generate = useAction(api.talks.generateTalkStudy);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const statusText = getStudyGenerateStatusText({
    error,
    hasTranscript,
    isPending,
  });

  function handleClick() {
    setError(null);
    setIsPending(true);

    void generate({ talkId })
      .then((result) => {
        if (result.status === 'failed') {
          setError(result.message);
        }
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
        data-testid="generate-study"
        disabled={!hasTranscript || isPending}
        loading={isPending}
        onClick={handleClick}
        size="sm"
        type="button"
        variant="outline"
      >
        Generate study
      </Button>
      {statusText ? (
        <p
          aria-live="polite"
          className="text-muted-foreground text-sm"
          data-testid="generate-study-status"
        >
          {statusText}
        </p>
      ) : null}
    </div>
  );
}
