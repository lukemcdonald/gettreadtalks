'use client';

import type { TalkId } from '@/features/talks/types';

import { useAction, useQuery } from 'convex/react';
import { useState } from 'react';

import { Button, FieldDescription } from '@/components/ui';
import { api } from '@/convex/_generated/api';
import { TALK_DRAFT_PENDING } from '@/convex/model/talks/validators';
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
  const talk = useQuery(api.talks.getTalk, { id: talkId });
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const draft = talk?.draftSummary;
  const draftPending = draft === TALK_DRAFT_PENDING;
  const pendingLabel = getTalkGeneratePendingLabel(
    canGenerate,
    hasTranscript,
    'summary'
  );
  const statusText =
    isPending || draftPending
      ? pendingLabel
      : getTalkGenerateIdleStatus(canGenerate, error ?? draft ?? null);

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
        disabled={!canGenerate || isPending || draftPending}
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
