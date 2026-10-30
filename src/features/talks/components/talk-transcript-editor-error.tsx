'use client';

import { formatErrorMessage } from '@/services/errors';

export function TalkTranscriptEditorError({ error }: { error: Error | null }) {
  if (!error) {
    return null;
  }

  return (
    <p className="text-destructive text-sm">{formatErrorMessage(error)}</p>
  );
}
