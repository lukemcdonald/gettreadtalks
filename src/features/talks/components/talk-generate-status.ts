import { NO_TRANSCRIPT_SOURCE_MESSAGE } from '@/convex/model/talks/summary/prompt';
import { TALK_DRAFT_PENDING } from '@/convex/model/talks/validators';

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
