'use client';

import type {
  TalkGenerationStage,
  TalkGenerationStatus,
} from '@/features/talks/components/talk-generate-status';
import type { TalkId } from '@/features/talks/types';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import {
  TALK_GENERATION_STAGE_LABEL,
  getTalkGenerationStatus,
} from '@/features/talks/components/talk-generate-status';

const STAGE_ORDER = ['transcript', 'summary', 'study'] as const;

function getStageText(stage: TalkGenerationStage) {
  const label = TALK_GENERATION_STAGE_LABEL[stage.kind];

  if (stage.kind === 'failed' && stage.message) {
    return `${label}. ${stage.message}`;
  }

  return label;
}

export function TalkGenerationStatusList({
  stages,
}: {
  stages: TalkGenerationStatus;
}) {
  return (
    <ul
      aria-label="Draft progress"
      aria-live="polite"
      className="text-muted-foreground mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm"
      data-testid="talk-generation-status"
    >
      {STAGE_ORDER.map((name) => {
        const stage = stages[name];

        return (
          <li
            data-state={stage.kind}
            data-testid={`talk-generation-status-${name}`}
            key={name}
          >
            <span className="text-foreground capitalize">{name}</span>{' '}
            {getStageText(stage)}
          </li>
        );
      })}
    </ul>
  );
}

export function EditTalkGenerationStatus({
  mediaUrl,
  talkId,
}: {
  mediaUrl: string;
  talkId: TalkId;
}) {
  const talk = useQuery(api.talks.getTalk, { id: talkId });
  const transcript = useQuery(api.talks.getTalkTranscript, { talkId });
  const fetch = useQuery(api.talks.getTalkTranscriptFetch, { talkId });
  const study = useQuery(api.talkFeatures.getTalkFeatureProgress, {
    kind: 'study',
    talkId,
  });

  if (
    fetch === undefined ||
    study === undefined ||
    talk === undefined ||
    talk === null ||
    transcript === undefined
  ) {
    return null;
  }

  return (
    <TalkGenerationStatusList
      stages={getTalkGenerationStatus({
        draftStudy: talk.draftStudy,
        draftSummary: talk.draftSummary,
        fetch,
        hasTranscript: Boolean(transcript),
        mediaUrl,
        study,
        summary: talk.summary,
      })}
    />
  );
}
