'use client';

import type { TalkId } from '@/features/talks/types';

import { useAction } from 'convex/react';
import { useState } from 'react';

import { Button } from '@/components/ui';
import { api } from '@/convex/_generated/api';
import { formatTalkGenerateStatusText } from '@/features/talks/components/talk-generate-status';

export function TalkStudyGenerate({
  canGenerate,
  hasTranscript,
  onGenerated,
  talkId,
}: {
  canGenerate: boolean;
  hasTranscript: boolean;
  onGenerated?: () => void;
  talkId: TalkId;
}) {
  const generate = useAction(api.talkFeatures.generateStudy);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const statusText = formatTalkGenerateStatusText({
    canGenerate,
    combinedPendingLabel: 'Getting transcript and generating study...',
    error,
    hasTranscript,
    isPending,
    pendingLabel: 'Generating study...',
  });

  function handleClick() {
    setError(null);
    setIsPending(true);

    void generate({ talkId })
      .then((result) => {
        if (result.status === 'failed') {
          setError(result.message);
          return;
        }

        onGenerated?.();
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
        disabled={!canGenerate || isPending}
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
