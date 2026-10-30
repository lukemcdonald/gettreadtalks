import { NO_TRANSCRIPT_SOURCE_MESSAGE } from '@/convex/lib/hasTalkTranscriptSource';

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
