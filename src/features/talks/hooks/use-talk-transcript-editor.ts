'use client';

import type { TalkId } from '@/features/talks/types';

import { useQuery } from 'convex/react';
import { useState } from 'react';

import { api } from '@/convex/_generated/api';
import { useMutation } from '@/hooks';

export function talkTranscriptCanSave(isReady: boolean, text: string) {
  return isReady && text.trim().length > 0;
}

export function talkTranscriptDisplayText(
  draft: string | undefined,
  loadedText: string | undefined
) {
  return draft ?? loadedText ?? '';
}

export function useTalkTranscriptEditor(talkId: TalkId) {
  const [draft, setDraft] = useState<string | undefined>();
  const transcript = useQuery(api.talks.getTalkTranscriptText, { talkId });
  const { error, isLoading, mutateAsync, reset } = useMutation(
    api.talks.updateTalkTranscript
  );
  const isReady = transcript !== undefined;
  const text = talkTranscriptDisplayText(draft, transcript?.text);

  function clearDraft() {
    reset();
    setDraft(undefined);
  }

  function saveTranscript() {
    void mutateAsync({ talkId, text }).then(clearDraft);
  }

  return {
    canCancel: draft !== undefined,
    canSave: talkTranscriptCanSave(isReady, text),
    error,
    handleCancel: clearDraft,
    handleChange: setDraft,
    handleSave: saveTranscript,
    isLoading,
    isReady,
    text,
  };
}
