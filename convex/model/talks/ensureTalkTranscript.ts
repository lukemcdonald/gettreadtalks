import type { Id } from '../../_generated/dataModel';
import type { ActionCtx } from '../../_generated/server';
import type { TranscriptFetchFailure } from './transcriptFetch';

import { internal } from '../../_generated/api';
import {
  hasTalkTranscriptSource,
  NO_TRANSCRIPT_SOURCE_MESSAGE,
} from '../../lib/hasTalkTranscriptSource';
import { resolveAndCompleteTalkTranscriptFetch } from './transcriptFetch';

export {
  hasTalkTranscriptSource,
  NO_TRANSCRIPT_SOURCE_MESSAGE,
} from '../../lib/hasTalkTranscriptSource';

export type EnsureTalkTranscriptResult =
  | TranscriptFetchFailure
  | {
      errorCode: 'NO_TRANSCRIPT_SOURCE';
      message: string;
      status: 'failed';
    }
  | { status: 'success'; text: string };

export interface GenerateTranscriptEnsureFailure {
  errorCode: 'NO_TRANSCRIPT_SOURCE' | 'UPSTREAM_ERROR';
  message: string;
}

export function toGenerateTranscriptEnsureFailure(
  ensured: Exclude<EnsureTalkTranscriptResult, { status: 'success' }>
): GenerateTranscriptEnsureFailure {
  if (ensured.errorCode === 'NO_TRANSCRIPT_SOURCE') {
    return {
      errorCode: 'NO_TRANSCRIPT_SOURCE',
      message: NO_TRANSCRIPT_SOURCE_MESSAGE,
    };
  }

  return {
    errorCode: 'UPSTREAM_ERROR',
    message: ensured.message,
  };
}

export async function loadTranscriptForGenerate(
  ctx: ActionCtx,
  talkId: Id<'talks'>,
  existingTranscript: string | null,
  mediaUrl: string
): Promise<{ transcript: string } | GenerateTranscriptEnsureFailure> {
  const ensured = await ensureTalkTranscriptText(
    ctx,
    talkId,
    existingTranscript,
    mediaUrl
  );

  if (ensured.status === 'success') {
    return {
      transcript: ensured.text,
    };
  }

  return toGenerateTranscriptEnsureFailure(ensured);
}

export async function ensureTalkTranscriptText(
  ctx: ActionCtx,
  talkId: Id<'talks'>,
  existingTranscript: string | null,
  mediaUrl: string
): Promise<EnsureTalkTranscriptResult> {
  const trimmed = existingTranscript?.trim();

  if (trimmed) {
    return {
      status: 'success',
      text: trimmed,
    };
  }

  if (!hasTalkTranscriptSource(mediaUrl)) {
    return {
      errorCode: 'NO_TRANSCRIPT_SOURCE',
      message: NO_TRANSCRIPT_SOURCE_MESSAGE,
      status: 'failed',
    };
  }

  const runId = await ctx.runMutation(
    internal.talks.insertPendingTalkTranscriptFetch,
    { talkId }
  );

  return await resolveAndCompleteTalkTranscriptFetch(ctx, {
    mediaUrl,
    runId,
    talkId,
  });
}
