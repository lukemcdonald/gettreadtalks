'use client';

import type { TalkId } from '@/features/talks/types';

import { useAction, useQuery } from 'convex/react';
import { useState } from 'react';

import { Button, FieldDescription } from '@/components/ui';
import { api } from '@/convex/_generated/api';
import {
  getTalkAutoDraftStatusText,
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
  const talk = useQuery(api.talks.getTalk, { id: talkId });
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const backgroundStatus = talk?.autoDraft?.summaryStatus;
  const backgroundPending = backgroundStatus === 'pending';
  const pendingLabel = getTalkGeneratePendingLabel(
    canGenerate,
    hasTranscript,
    'summary'
  );
  const statusText = isPending
    ? pendingLabel
    : (error ??
      getTalkAutoDraftStatusText(
        backgroundStatus,
        talk?.autoDraft?.summaryMessage,
        pendingLabel
      ) ??
      getTalkGenerateIdleStatus(canGenerate, null));

  async function handleClick() {
    setError(null);
    setIsPending(true);
    onFlagsChange?.([]);

    try {
      const result = await generate({ talkId });

      if (result.status === 'failed') {
        setError(result.message);
      } else {
        onFlagsChange?.(result.flags);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    }

    setIsPending(false);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        data-testid="generate-summary"
        disabled={!canGenerate || isPending || backgroundPending}
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
