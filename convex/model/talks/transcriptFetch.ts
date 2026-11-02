import type { Id } from '../../_generated/dataModel';
import type { ActionCtx, MutationCtx } from '../../_generated/server';
import type { TranscriptFetchErrorCode } from './validators';

import { v } from 'convex/values';

import { internal } from '../../_generated/api';
import { internalAction, internalMutation } from '../../_generated/server';
import { getVideoId, hasTalkTranscriptSource } from '../../lib/videoUrl';
import { NO_TRANSCRIPT_SOURCE_MESSAGE } from './summary/prompt';
import { TRANSCRIPT_FETCH_ERROR_CODES } from './validators';

export async function findOrInsertPendingTalkTranscriptFetch(
  ctx: MutationCtx,
  talkId: Id<'talks'>
) {
  const existingFetches = await ctx.db
    .query('talkTranscriptFetches')
    .withIndex('by_talkId', (q) => q.eq('talkId', talkId))
    .collect();
  const pending = existingFetches.find((row) => row.status === 'pending');

  if (pending) {
    return pending._id;
  }

  return await ctx.db.insert('talkTranscriptFetches', {
    checkedAt: Date.now(),
    status: 'pending',
    talkId,
  });
}

const YOUTUBE_TRANSCRIPT_API_URL =
  'https://www.youtube-transcript.io/api/transcripts';

const TRANSCRIPT_FETCH_MESSAGES = {
  LOGIN_REQUIRED: 'YouTube requires a login to view this talk.',
  NO_CAPTIONS: 'No captions are available for this talk.',
  NOT_YOUTUBE: 'Transcripts can only be fetched from YouTube talks.',
  QUOTA_EXHAUSTED: 'The monthly transcript quota has been used up.',
  RATE_LIMITED: 'Too many transcript requests.',
  TOKEN_INVALID: 'Transcript service rejected the request.',
  TOKEN_MISSING: 'Transcript service is not configured.',
} as const;

type TranscriptFetchResult =
  | TranscriptFetchFailure
  | { status: 'success'; text: string };

function getQuotaResetAt(nowMs: number) {
  const now = new Date(nowMs);
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  let reset = Date.UTC(year, month, 21);

  if (nowMs >= reset) {
    reset = Date.UTC(year, month + 1, 21);
  }

  return reset;
}

function parseRetryAfter(header: string | null, nowMs: number) {
  if (!header) {
    return;
  }

  const seconds = Number(header);

  if (Number.isFinite(seconds)) {
    return nowMs + seconds * 1000;
  }

  const date = Date.parse(header);

  if (Number.isFinite(date)) {
    return date;
  }
}

export function toTranscriptHttpError(
  status: number,
  body: string,
  retryAfterHeader: string | null,
  nowMs: number
): TranscriptFetchFailure {
  if (status === 429) {
    return {
      errorCode: TRANSCRIPT_FETCH_ERROR_CODES.RATE_LIMITED,
      message: TRANSCRIPT_FETCH_MESSAGES.RATE_LIMITED,
      retryAfter: parseRetryAfter(retryAfterHeader, nowMs),
      status: 'failed',
    };
  }

  if (
    status === 402 ||
    /credit|limit exceeded|limit reached|quota/iu.test(body)
  ) {
    return {
      errorCode: TRANSCRIPT_FETCH_ERROR_CODES.QUOTA_EXHAUSTED,
      message: TRANSCRIPT_FETCH_MESSAGES.QUOTA_EXHAUSTED,
      retryAfter: getQuotaResetAt(nowMs),
      status: 'failed',
    };
  }

  if (status === 401 || status === 403) {
    return {
      errorCode: TRANSCRIPT_FETCH_ERROR_CODES.TOKEN_INVALID,
      message: TRANSCRIPT_FETCH_MESSAGES.TOKEN_INVALID,
      status: 'failed',
    };
  }

  return {
    errorCode: TRANSCRIPT_FETCH_ERROR_CODES.UPSTREAM_ERROR,
    message: `Transcript service returned an error (HTTP ${status}).`,
    status: 'failed',
  };
}

function getVideoText(video: Record<string, unknown>) {
  if (typeof video.text === 'string' && video.text.trim()) {
    return video.text;
  }

  const { tracks } = video;

  if (!Array.isArray(tracks) || tracks.length === 0) {
    return '';
  }

  const [first] = tracks;

  if (!first || typeof first !== 'object') {
    return '';
  }

  const { transcript } = first as { transcript?: unknown };

  if (!Array.isArray(transcript)) {
    return '';
  }

  return transcript
    .map((segment) => {
      if (!segment || typeof segment !== 'object') {
        return '';
      }

      const { text } = segment as { text?: unknown };

      return typeof text === 'string' ? text : '';
    })
    .filter(Boolean)
    .join(' ');
}

export function parseTranscriptApiVideo(value: unknown): TranscriptFetchResult {
  if (!value || typeof value !== 'object') {
    return {
      errorCode: TRANSCRIPT_FETCH_ERROR_CODES.UPSTREAM_ERROR,
      message: 'Transcript service returned an error (HTTP 200).',
      status: 'failed',
    };
  }

  const video = value as Record<string, unknown>;
  const { playabilityStatus } = video;
  const reason =
    playabilityStatus &&
    typeof playabilityStatus === 'object' &&
    'reason' in playabilityStatus &&
    typeof playabilityStatus.reason === 'string'
      ? playabilityStatus.reason
      : '';

  if (video.isLoginRequired === true || /login required/iu.test(reason)) {
    return {
      errorCode: TRANSCRIPT_FETCH_ERROR_CODES.LOGIN_REQUIRED,
      message: TRANSCRIPT_FETCH_MESSAGES.LOGIN_REQUIRED,
      status: 'failed',
    };
  }

  const text = getVideoText(video)
    .replaceAll(/\[(?:[^\]]+)\]/gu, ' ')
    .replaceAll(/\s+/gu, ' ')
    .trim();

  if (!text) {
    return {
      errorCode: TRANSCRIPT_FETCH_ERROR_CODES.NO_CAPTIONS,
      message: TRANSCRIPT_FETCH_MESSAGES.NO_CAPTIONS,
      status: 'failed',
    };
  }

  return {
    status: 'success',
    text,
  };
}

async function loadYoutubeTranscript(
  videoId: string,
  token: string,
  nowMs = Date.now()
): Promise<TranscriptFetchResult> {
  let response: Response;

  try {
    response = await fetch(YOUTUBE_TRANSCRIPT_API_URL, {
      body: JSON.stringify({ ids: [videoId] }),
      headers: {
        Authorization: token.startsWith('Basic ') ? token : `Basic ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
  } catch {
    return {
      errorCode: TRANSCRIPT_FETCH_ERROR_CODES.UPSTREAM_ERROR,
      message: 'Transcript service is unavailable.',
      status: 'failed',
    };
  }

  const body = await response.text();

  if (!response.ok) {
    return toTranscriptHttpError(
      response.status,
      body,
      response.headers.get('Retry-After'),
      nowMs
    );
  }

  try {
    const parsed: unknown = JSON.parse(body);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return {
        errorCode: TRANSCRIPT_FETCH_ERROR_CODES.NO_CAPTIONS,
        message: TRANSCRIPT_FETCH_MESSAGES.NO_CAPTIONS,
        status: 'failed',
      };
    }

    return parseTranscriptApiVideo(parsed[0]);
  } catch {
    return {
      errorCode: TRANSCRIPT_FETCH_ERROR_CODES.UPSTREAM_ERROR,
      message: 'Transcript service returned an error (HTTP 200).',
      status: 'failed',
    };
  }
}

function toFailedResult(
  errorCode: Exclude<
    TranscriptFetchErrorCode,
    typeof TRANSCRIPT_FETCH_ERROR_CODES.UPSTREAM_ERROR
  >
): TranscriptFetchFailure {
  return {
    errorCode,
    message: TRANSCRIPT_FETCH_MESSAGES[errorCode],
    status: 'failed',
  };
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
    mediaUrl: string;
    runId: Id<'talkTranscriptFetches'>;
    talkId: Id<'talks'>;
  }
): Promise<TranscriptFetchResult> {
  const result = await talkTranscriptFetcher.fetch(
    args.mediaUrl,
    process.env.YOUTUBE_TRANSCRIPT_IO_TOKEN ?? ''
  );

  await ctx.runMutation(
    internal.talks.completeTalkTranscriptFetch,
    toCompleteTalkTranscriptFetchArgs(result, args.runId, args.talkId)
  );

  return result;
}

export function fetchTranscript(
  mediaUrl: string,
  token: string
): Promise<TranscriptFetchResult> {
  if (!token) {
    return Promise.resolve(
      toFailedResult(TRANSCRIPT_FETCH_ERROR_CODES.TOKEN_MISSING)
    );
  }

  const video = getVideoId(mediaUrl);

  if (video?.service !== 'youtube') {
    return Promise.resolve(
      toFailedResult(TRANSCRIPT_FETCH_ERROR_CODES.NOT_YOUTUBE)
    );
  }

  return loadYoutubeTranscript(video.id, token);
}

export const insertPendingTalkTranscriptFetch = internalMutation({
  args: {
    talkId: v.id('talks'),
  },
  handler: async (ctx, { talkId }) =>
    await findOrInsertPendingTalkTranscriptFetch(ctx, talkId),
  returns: v.id('talkTranscriptFetches'),
});

export const fetchTalkTranscript = internalAction({
  args: {
    mediaUrl: v.string(),
    runId: v.id('talkTranscriptFetches'),
    talkId: v.id('talks'),
  },
  handler: async (ctx, args) => {
    await fetchAndCompleteTalkTranscript(ctx, args);

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

  return await fetchAndCompleteTalkTranscript(ctx, {
    mediaUrl,
    runId,
    talkId,
  });
}
