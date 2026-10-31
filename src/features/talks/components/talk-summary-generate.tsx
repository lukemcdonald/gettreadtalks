'use client';

import type { TalkId } from '@/features/talks/types';

import { useAction } from 'convex/react';
import { useState } from 'react';

import { Button, FieldDescription } from '@/components/ui';
import { api } from '@/convex/_generated/api';
import {
  getTalkGenerateIdleStatus,
  getTalkGeneratePendingLabel,
} from '@/features/talks/components/talk-generate-status';

export function TalkSummaryGenerate({
  canGenerate,
  hasTranscript,
  onFlagsChange,
  talkId,
}: {
  canGenerate: boolean;
  hasTranscript: boolean;
  onFlagsChange?: (flags: string[]) => void;
  talkId: TalkId;
}) {
  const generate = useAction(api.talks.generateTalkSummary);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const statusText = isPending
    ? getTalkGeneratePendingLabel(canGenerate, hasTranscript, 'summary')
    : getTalkGenerateIdleStatus(canGenerate, error);

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
        disabled={!canGenerate || isPending}
        loading={isPending}
        onClick={handleClick}
        size="sm"
        type="button"
        variant="outline"
      >
        Generate summary
      </Button>
      {statusText ? (
        <FieldDescription
          aria-live="polite"
          data-testid="generate-summary-status"
        >
          {statusText}
        </FieldDescription>
      ) : null}
    </div>
  );
}
