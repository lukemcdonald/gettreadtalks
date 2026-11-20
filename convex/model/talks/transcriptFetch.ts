import type { Id } from '../../_generated/dataModel';
import type { ActionCtx, MutationCtx } from '../../_generated/server';
import type { TranscriptFetchErrorCode } from './validators';

import { v } from 'convex/values';

import { internal } from '../../_generated/api';
import { internalAction, internalMutation } from '../../_generated/server';
import { hasTalkTranscriptSource } from '../../lib/videoUrl';
import { NO_TRANSCRIPT_SOURCE_MESSAGE } from './summary/prompt';

export async function createPendingTalkTranscriptFetch(
  ctx: MutationCtx,
  args: { talkId: Id<'talks'> }
) {
  return await ctx.db.insert('talkTranscriptFetches', {
    checkedAt: Date.now(),
    status: 'pending',
    talkId: args.talkId,
  });
}

const TRANSCRIPTS_API_URL =
  'https://transcripts.lukemcdonald.com/api/transcripts';

const TRANSCRIPT_FETCH_MESSAGES: Record<TranscriptFetchErrorCode, string> = {
  NO_TRANSCRIPT: 'No transcript is available for this talk.',
  NOT_FOUND: 'The video was not found. It may be deleted or private.',
  PROVIDER_AUTH_FAILED: 'Transcript service is not configured correctly.',
  PROVIDER_ERROR: 'Transcript service returned an error.',
  QUOTA_EXCEEDED: 'The transcript service is out of transcription credits.',
  QUOTA_EXHAUSTED: 'The monthly transcript quota has been used up.',
  RATE_LIMITED: 'Too many transcript requests.',
  RESTRICTED: 'The video needs sign-in or is age or region restricted.',
  TIMED_OUT: 'The transcript took too long to fetch.',
  UNSUPPORTED_URL: 'The transcript service does not support this media URL.',
};

type TranscriptFetchResult =
  | TranscriptFetchFailure
  | { status: 'success'; text: string };

function toFailedResult(
  errorCode: TranscriptFetchErrorCode,
  retryAfter?: number
): TranscriptFetchFailure {
  return {
    errorCode,
    message: TRANSCRIPT_FETCH_MESSAGES[errorCode],
    ...(retryAfter ? { retryAfter } : {}),
    status: 'failed',
  };
}

function isTranscriptFetchErrorCode(
  value: unknown
): value is TranscriptFetchErrorCode {
  return (
    typeof value === 'string' && Object.hasOwn(TRANSCRIPT_FETCH_MESSAGES, value)
  );
}

function parseRetryAfter(value: unknown) {
  const retryAfter = typeof value === 'string' ? Date.parse(value) : Number.NaN;

  return Number.isFinite(retryAfter) ? retryAfter : undefined;
}

/** Unknown failures, including INVALID_REQUEST, become PROVIDER_ERROR. */
function toTranscriptFetchResult(
  response: Response,
  body: unknown
): TranscriptFetchResult {
  const data = (body ?? {}) as Record<string, unknown>;
  const text = typeof data.text === 'string' ? data.text.trim() : '';

  if (response.ok && text) {
    return { status: 'success', text };
  }

  if (response.status === 401) {
    return toFailedResult('PROVIDER_AUTH_FAILED');
  }

  return toFailedResult(
    isTranscriptFetchErrorCode(data.code) ? data.code : 'PROVIDER_ERROR',
    parseRetryAfter(data.retryAfter)
  );
}

export async function fetchTranscript(
  mediaUrl: string,
  token: string
): Promise<TranscriptFetchResult> {
  if (!token) {
    return toFailedResult('PROVIDER_AUTH_FAILED');
  }

  try {
    const response = await fetch(TRANSCRIPTS_API_URL, {
      body: JSON.stringify({ url: mediaUrl }),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
    const body: unknown = await response.json().catch(() => null);

    return toTranscriptFetchResult(response, body);
  } catch {
    return toFailedResult('PROVIDER_ERROR');
  }
}

export interface TranscriptFetchFailure {
  errorCode: TranscriptFetchErrorCode;
  message: string;
  retryAfter?: number;
  status: 'failed';
}

export const talkTranscriptFetcher = {
  fetch: fetchTranscript,
};

function toCompleteTalkTranscriptFetchArgs(
  result: TranscriptFetchResult,
  runId: Id<'talkTranscriptFetches'>,
  talkId: Id<'talks'>
) {
  return {
    runId,
    talkId,
    ...(result.status === 'failed'
      ? {
          errorCode: result.errorCode,
          message: result.message,
          retryAfter: result.retryAfter,
          status: 'failed' as const,
        }
      : {
          status: 'success' as const,
          text: result.text,
        }),
  };
}

export async function fetchAndCompleteTalkTranscript(
  ctx: ActionCtx,
  args: {
    keepExistingTranscript?: boolean;
    mediaUrl: string;
    runId: Id<'talkTranscriptFetches'>;
    talkId: Id<'talks'>;
  }
): Promise<TranscriptFetchResult> {
  const result = await talkTranscriptFetcher.fetch(
    args.mediaUrl,
    process.env.TRANSCRIPTS_API_TOKEN ?? ''
  );

  await ctx.runMutation(internal.talks.completeTalkTranscriptFetch, {
    ...toCompleteTalkTranscriptFetchArgs(result, args.runId, args.talkId),
    ...(args.keepExistingTranscript ? { keepExistingTranscript: true } : {}),
  });

  return result;
}

export const insertPendingTalkTranscriptFetch = internalMutation({
  args: {
    talkId: v.id('talks'),
  },
  handler: async (ctx, { talkId }) =>
    await createPendingTalkTranscriptFetch(ctx, { talkId }),
  returns: v.id('talkTranscriptFetches'),
});

export const fetchTalkTranscript = internalAction({
  args: {
    continueDraft: v.optional(v.boolean()),
    mediaUrl: v.string(),
    runId: v.id('talkTranscriptFetches'),
    talkId: v.id('talks'),
  },
  handler: async (ctx, args) => {
    if (args.continueDraft) {
      const source: { transcript: string | null } = await ctx.runQuery(
        internal.talks.loadTalkDraftSource,
        { talkId: args.talkId }
      );

      if (source.transcript?.trim()) {
        await ctx.runMutation(internal.talks.completeTalkTranscriptFetch, {
          runId: args.runId,
          status: 'success',
          talkId: args.talkId,
        });
        await ctx.scheduler.runAfter(
          0,
          internal.talks.draftTalkSummaryAndStudy,
          { talkId: args.talkId }
        );

        return null;
      }
    }

    const result = await fetchAndCompleteTalkTranscript(ctx, {
      keepExistingTranscript: args.continueDraft,
      mediaUrl: args.mediaUrl,
      runId: args.runId,
      talkId: args.talkId,
    });

    if (args.continueDraft && result.status === 'success') {
      await ctx.scheduler.runAfter(0, internal.talks.draftTalkSummaryAndStudy, {
        talkId: args.talkId,
      });
    }

    return null;
  },
  returns: v.null(),
});

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
  if (
    ensured.errorCode === 'NO_TRANSCRIPT_SOURCE' ||
    ensured.errorCode === 'UNSUPPORTED_URL'
  ) {
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

interface TranscriptEnsureArgs {
  existingTranscript: string | null;
  mediaUrl: string;
  talkId: Id<'talks'>;
}

export async function loadTranscriptForGenerate(
  ctx: ActionCtx,
  args: TranscriptEnsureArgs
): Promise<{ transcript: string } | GenerateTranscriptEnsureFailure> {
  const ensured = await ensureTalkTranscriptText(ctx, args);

  if (ensured.status === 'success') {
    return {
      transcript: ensured.text,
    };
  }

  return toGenerateTranscriptEnsureFailure(ensured);
}

export async function ensureTalkTranscriptText(
  ctx: ActionCtx,
  args: TranscriptEnsureArgs
): Promise<EnsureTalkTranscriptResult> {
  const trimmed = args.existingTranscript?.trim();

  if (trimmed) {
    return {
      status: 'success',
      text: trimmed,
    };
  }

  if (!hasTalkTranscriptSource(args.mediaUrl)) {
    return {
      errorCode: 'NO_TRANSCRIPT_SOURCE',
      message: NO_TRANSCRIPT_SOURCE_MESSAGE,
      status: 'failed',
    };
  }

  const runId = await ctx.runMutation(
    internal.talks.insertPendingTalkTranscriptFetch,
    { talkId: args.talkId }
  );

  return await fetchAndCompleteTalkTranscript(ctx, {
    mediaUrl: args.mediaUrl,
    runId,
    talkId: args.talkId,
  });
}
