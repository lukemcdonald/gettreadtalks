'use client';

import type { TalkId } from '@/features/talks/types';

import { useAction, useQuery } from 'convex/react';
import { useState } from 'react';

import { Button } from '@/components/ui';
import { api } from '@/convex/_generated/api';
import {
  getTalkAutoDraftStatusText,
  getTalkGenerateIdleStatus,
  getTalkGeneratePendingLabel,
} from '@/features/talks/components/talk-generate-status';

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
  const talk = useQuery(api.talks.getTalk, { id: talkId });
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const backgroundStatus = talk?.autoDraft?.studyStatus;
  const backgroundPending = backgroundStatus === 'pending';
  const pendingLabel = getTalkGeneratePendingLabel(
    canGenerate,
    hasTranscript,
    'study'
  );
  const statusText = isPending
    ? pendingLabel
    : (error ??
      getTalkAutoDraftStatusText(
        backgroundStatus,
        talk?.autoDraft?.studyMessage,
        pendingLabel
      ) ??
      getTalkGenerateIdleStatus(canGenerate, null));

  async function handleClick() {
    setError(null);
    setIsPending(true);

    try {
      const result = await generate({ talkId });

      if (result.status === 'failed') {
        setError(result.message);
      } else {
        onGenerated?.();
      }
    } catch {
      setError('Something went wrong. Please try again.');
    }

    setIsPending(false);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        data-testid="generate-study"
        disabled={!canGenerate || isPending || backgroundPending}
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
