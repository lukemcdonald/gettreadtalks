import { NO_TRANSCRIPT_SOURCE_MESSAGE } from '@/convex/model/talks/summary/prompt';
import { TALK_DRAFT_PENDING } from '@/convex/model/talks/validators';
import {
  formatTranscriptFetchFailure,
  hasTalkTranscriptSource,
} from '@/features/talks/utils';

const TALK_DRAFT_STATUS_TEXT = new Set([
  'Study service is not configured.',
  'Study service returned an error.',
  'Summary service is not configured.',
  'Summary service returned an error.',
  'This study has already been reviewed.',
  'This summary has already been edited.',
  NO_TRANSCRIPT_SOURCE_MESSAGE,
  TALK_DRAFT_PENDING,
]);

export const TALK_CREATE_YOUTUBE_DRAFT_HINT =
  'After you create this talk, we will fetch the transcript and draft a summary and study.';

export const TALK_GENERATION_STAGE_LABEL = {
  draft: 'Draft ready',
  failed: 'Failed',
  fetching: 'Fetching',
  generating: 'Generating',
  missing: 'None',
  published: 'Published',
  ready: 'Ready',
  saved: 'Saved',
  unavailable: 'Unavailable',
  waiting: 'Waiting',
} as const;

export type TalkGenerationStageKind = keyof typeof TALK_GENERATION_STAGE_LABEL;

export interface TalkGenerationStage {
  kind: TalkGenerationStageKind;
  message?: string;
}

export interface TalkGenerationStatus {
  study: TalkGenerationStage;
  summary: TalkGenerationStage;
  transcript: TalkGenerationStage;
}

export function isTalkDraftStatus(value: string | null | undefined) {
  return (
    value !== undefined && value !== null && TALK_DRAFT_STATUS_TEXT.has(value)
  );
}

export function getTalkGenerateIdleStatus(
  canGenerate: boolean,
  error: string | null
) {
  if (error) {
    return error;
  }

  if (!canGenerate) {
    return NO_TRANSCRIPT_SOURCE_MESSAGE;
  }

  return null;
}

export function getTalkGeneratePendingLabel(
  canGenerate: boolean,
  hasTranscript: boolean,
  kind: 'study' | 'summary'
) {
  const label = kind === 'summary' ? 'summary' : 'study';

  if (canGenerate && !hasTranscript) {
    return `Getting transcript and generating ${label}...`;
  }

  return `Generating ${label}...`;
}

export function getTalkCreateGenerationHint(mediaUrl: string) {
  const trimmed = mediaUrl.trim();

  if (!trimmed) {
    return null;
  }

  if (hasTalkTranscriptSource(trimmed)) {
    return TALK_CREATE_YOUTUBE_DRAFT_HINT;
  }

  return NO_TRANSCRIPT_SOURCE_MESSAGE;
}

export function getTalkSummaryEditorValue(
  talk: {
    draftSummary?: string;
    summary?: string;
  } | null
) {
  if (!talk) {
    return '';
  }

  if (talk.draftSummary && !isTalkDraftStatus(talk.draftSummary)) {
    return talk.draftSummary;
  }

  return talk.summary ?? '';
}

export function shouldOpenTalkStudyPreview({
  hadBody,
  hasBody,
  isDirty,
}: {
  hadBody: boolean;
  hasBody: boolean;
  isDirty: boolean;
}) {
  return !hadBody && hasBody && !isDirty;
}

function getTalkDraftStep(draft: string | null | undefined) {
  if (!draft) {
    return { kind: 'none' } as const;
  }

  if (draft === TALK_DRAFT_PENDING) {
    return { kind: 'generating' } as const;
  }

  if (isTalkDraftStatus(draft)) {
    return { kind: 'failed', message: draft } as const;
  }

  return { kind: 'draft' } as const;
}

function getTranscriptStage({
  fetch,
  hasSource,
  hasTranscript,
}: {
  fetch: {
    message?: string;
    retryAfter?: number;
    status?: string;
  } | null;
  hasSource: boolean;
  hasTranscript: boolean;
}): TalkGenerationStage {
  if (hasTranscript || fetch?.status === 'success') {
    return { kind: 'ready' };
  }

  if (fetch?.status === 'pending') {
    return { kind: 'fetching' };
  }

  if (fetch?.status === 'failed') {
    return {
      kind: 'failed',
      message: formatTranscriptFetchFailure(fetch) ?? undefined,
    };
  }

  if (!hasSource) {
    return { kind: 'unavailable' };
  }

  return { kind: 'missing' };
}

function getSummaryStage({
  draft,
  hasSaved,
  hasSource,
}: {
  draft: ReturnType<typeof getTalkDraftStep>;
  hasSaved: boolean;
  hasSource: boolean;
}): TalkGenerationStage {
  if (draft.kind === 'generating') {
    return { kind: 'generating' };
  }

  if (hasSaved) {
    return { kind: 'saved' };
  }

  if (draft.kind === 'draft') {
    return { kind: 'draft' };
  }

  if (draft.kind === 'failed') {
    return { kind: 'failed', message: draft.message };
  }

  if (!hasSource) {
    return { kind: 'unavailable' };
  }

  return { kind: 'missing' };
}

function getStudyStage({
  draft,
  hasBody,
  hasSource,
  isPublished,
  isSummaryGenerating,
}: {
  draft: ReturnType<typeof getTalkDraftStep>;
  hasBody: boolean;
  hasSource: boolean;
  isPublished: boolean;
  isSummaryGenerating: boolean;
}): TalkGenerationStage {
  if (draft.kind === 'generating') {
    return { kind: 'generating' };
  }

  if (isPublished) {
    return { kind: 'published' };
  }

  if (hasBody) {
    return { kind: 'draft' };
  }

  if (draft.kind === 'failed') {
    return { kind: 'failed', message: draft.message };
  }

  if (isSummaryGenerating) {
    return { kind: 'waiting' };
  }

  if (!hasSource) {
    return { kind: 'unavailable' };
  }

  return { kind: 'missing' };
}

export function getTalkGenerationStatus({
  draftStudy,
  draftSummary,
  fetch,
  hasTranscript,
  mediaUrl,
  study,
  summary,
}: {
  draftStudy?: string;
  draftSummary?: string;
  fetch: {
    message?: string;
    retryAfter?: number;
    status?: string;
  } | null;
  hasTranscript: boolean;
  mediaUrl: string;
  study: { hasBody: boolean; status: 'draft' | 'published' } | null;
  summary?: string;
}): TalkGenerationStatus {
  const hasSource = hasTalkTranscriptSource(mediaUrl);
  const summaryDraft = getTalkDraftStep(draftSummary);
  const studyDraft = getTalkDraftStep(draftStudy);
  const transcript = getTranscriptStage({
    fetch,
    hasSource,
    hasTranscript,
  });

  return {
    study: getStudyStage({
      draft: studyDraft,
      hasBody: Boolean(study?.hasBody),
      hasSource,
      isPublished: study?.status === 'published',
      isSummaryGenerating: summaryDraft.kind === 'generating',
    }),
    summary: getSummaryStage({
      draft: summaryDraft,
      hasSaved: Boolean(summary?.trim()),
      hasSource,
    }),
    transcript,
  };
}
