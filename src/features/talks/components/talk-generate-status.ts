import { NO_TRANSCRIPT_SOURCE_MESSAGE } from '@/convex/model/talks/ensureTalkTranscript';

// fallow-ignore-next-line complexity
export function formatTalkGenerateStatusText({
  canGenerate,
  combinedPendingLabel,
  error,
  hasTranscript,
  isPending,
  pendingLabel,
}: {
  canGenerate: boolean;
  combinedPendingLabel: string;
  error: string | null;
  hasTranscript: boolean;
  isPending: boolean;
  pendingLabel: string;
}) {
  if (isPending) {
    return canGenerate && !hasTranscript ? combinedPendingLabel : pendingLabel;
  }

  if (error) {
    return error;
  }

  if (!canGenerate) {
    return NO_TRANSCRIPT_SOURCE_MESSAGE;
  }

  return null;
}
