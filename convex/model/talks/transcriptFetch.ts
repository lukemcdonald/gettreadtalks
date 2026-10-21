import type { Id } from '../../_generated/dataModel';

import { v } from 'convex/values';

import { internal } from '../../_generated/api';
import { internalAction } from '../../_generated/server';

export const TRANSCRIPT_QUOTA_RESET_DAY = 21;

const YOUTUBE_TRANSCRIPT_API_URL =
  'https://www.youtube-transcript.io/api/transcripts';

const YOUTUBE_ID_PATTERNS = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)(?<id>[^&\n?#]+)/u,
  /youtube\.com\/watch\?.*v=(?<id>[^&\n?#]+)/u,
];

export const TRANSCRIPT_FETCH_MESSAGES = {
  login_required: 'YouTube requires a login to view this talk.',
  no_captions: 'No captions are available for this talk.',
  not_youtube: 'Transcripts can only be fetched from YouTube talks.',
  quota_exhausted: 'The monthly transcript quota has been used up.',
  rate_limited: 'Too many transcript requests.',
  token_invalid: 'Transcript service rejected the request.',
  token_missing: 'Transcript service is not configured.',
} as const;

export type TranscriptFetchErrorCode =
  | 'login_required'
  | 'no_captions'
  | 'not_youtube'
  | 'quota_exhausted'
  | 'rate_limited'
  | 'token_invalid'
  | 'token_missing'
  | 'upstream_error';

export interface TranscriptFetchFailure {
  errorCode: TranscriptFetchErrorCode;
  message: string;
  retryAfter?: number;
  status: 'failed';
}

export interface TranscriptFetchSuccess {
  status: 'success';
  text: string;
  wordCount: number;
}

export type TranscriptFetchResult =
  | TranscriptFetchFailure
  | TranscriptFetchSuccess;

export function parseYouTubeVideoId(url: string) {
  for (const pattern of YOUTUBE_ID_PATTERNS) {
    const match = url.match(pattern);
    if (match?.groups?.id) {
      return match.groups.id;
    }
  }

  return null;
}

export function stripTranscriptTags(text: string) {
  return text
    .replaceAll(/\[(?:[^\]]+)\]/gu, ' ')
    .replaceAll(/\s+/gu, ' ')
    .trim();
}

export function getTranscriptWordCount(text: string) {
  if (!text) {
    return 0;
  }

  return text.split(/\s+/u).filter(Boolean).length;
}

export function getQuotaResetAt(
  nowMs: number,
  resetDay = TRANSCRIPT_QUOTA_RESET_DAY
) {
  const now = new Date(nowMs);
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  let reset = Date.UTC(year, month, resetDay);

  if (nowMs >= reset) {
    reset = Date.UTC(year, month + 1, resetDay);
  }

  return reset;
}

export function parseRetryAfter(header: string | null, nowMs: number) {
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

function isQuotaMessage(body: string) {
  return /credit|limit exceeded|limit reached|quota/iu.test(body);
}

export function toTranscriptHttpError(
  status: number,
  body: string,
  retryAfterHeader: string | null,
  nowMs: number
): TranscriptFetchFailure {
  if (status === 429) {
    return {
      errorCode: 'rate_limited',
      message: TRANSCRIPT_FETCH_MESSAGES.rate_limited,
      retryAfter: parseRetryAfter(retryAfterHeader, nowMs),
      status: 'failed',
    };
  }

  if (status === 402 || isQuotaMessage(body)) {
    return {
      errorCode: 'quota_exhausted',
      message: TRANSCRIPT_FETCH_MESSAGES.quota_exhausted,
      retryAfter: getQuotaResetAt(nowMs),
      status: 'failed',
    };
  }

  if (status === 401 || status === 403) {
    return {
      errorCode: 'token_invalid',
      message: TRANSCRIPT_FETCH_MESSAGES.token_invalid,
      status: 'failed',
    };
  }

  return {
    errorCode: 'upstream_error',
    message: `Transcript service returned an error (HTTP ${status}).`,
    status: 'failed',
  };
}

function getPlayabilityReason(video: Record<string, unknown>) {
  const { playabilityStatus } = video;

  if (!playabilityStatus || typeof playabilityStatus !== 'object') {
    return '';
  }

  const { reason } = playabilityStatus as { reason?: unknown };

  return typeof reason === 'string' ? reason : '';
}

function getTrackText(video: Record<string, unknown>) {
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

function getVideoText(video: Record<string, unknown>) {
  if (typeof video.text === 'string' && video.text.trim()) {
    return video.text;
  }

  return getTrackText(video);
}

export function parseTranscriptApiVideo(value: unknown): TranscriptFetchResult {
  if (!value || typeof value !== 'object') {
    return {
      errorCode: 'upstream_error',
      message: 'Transcript service returned an error (HTTP 200).',
      status: 'failed',
    };
  }

  const video = value as Record<string, unknown>;
  const reason = getPlayabilityReason(video);

  if (video.isLoginRequired === true || /login required/iu.test(reason)) {
    return {
      errorCode: 'login_required',
      message: TRANSCRIPT_FETCH_MESSAGES.login_required,
      status: 'failed',
    };
  }

  const text = stripTranscriptTags(getVideoText(video));

  if (!text) {
    return {
      errorCode: 'no_captions',
      message: TRANSCRIPT_FETCH_MESSAGES.no_captions,
      status: 'failed',
    };
  }

  return {
    status: 'success',
    text,
    wordCount: getTranscriptWordCount(text),
  };
}

function getAuthorizationHeader(token: string) {
  if (token.startsWith('Basic ')) {
    return token;
  }

  return `Basic ${token}`;
}

export async function loadYoutubeTranscript(
  videoId: string,
  token: string,
  fetchImpl: typeof fetch = fetch,
  nowMs = Date.now()
): Promise<TranscriptFetchResult> {
  let response: Response;

  try {
    response = await fetchImpl(YOUTUBE_TRANSCRIPT_API_URL, {
      body: JSON.stringify({ ids: [videoId] }),
      headers: {
        Authorization: getAuthorizationHeader(token),
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
  } catch {
    return {
      errorCode: 'upstream_error',
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

  let parsed: unknown;

  try {
    parsed = JSON.parse(body);
  } catch {
    return {
      errorCode: 'upstream_error',
      message: 'Transcript service returned an error (HTTP 200).',
      status: 'failed',
    };
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    return {
      errorCode: 'no_captions',
      message: TRANSCRIPT_FETCH_MESSAGES.no_captions,
      status: 'failed',
    };
  }

  return parseTranscriptApiVideo(parsed[0]);
}

function toFailedResult(
  errorCode: Exclude<TranscriptFetchErrorCode, 'upstream_error'>
): TranscriptFetchFailure {
  return {
    errorCode,
    message: TRANSCRIPT_FETCH_MESSAGES[errorCode],
    status: 'failed',
  };
}

function resolveTranscriptFetch(
  mediaUrl: string,
  token: string
): Promise<TranscriptFetchResult> {
  if (!token) {
    return Promise.resolve(toFailedResult('token_missing'));
  }

  const videoId = parseYouTubeVideoId(mediaUrl);

  if (!videoId) {
    return Promise.resolve(toFailedResult('not_youtube'));
  }

  return loadYoutubeTranscript(videoId, token);
}

interface TalkTranscriptFetchContext {
  confirmRefetch: boolean;
  mediaUrl: string;
  runId: Id<'talkTranscriptFetches'>;
  talkId: Id<'talks'>;
}

export const fetchTalkTranscript = internalAction({
  args: { runId: v.id('talkTranscriptFetches') },
  handler: async (ctx, { runId }) => {
    const context: TalkTranscriptFetchContext | null = await ctx.runQuery(
      internal.talks.getTalkTranscriptFetchContext,
      { runId }
    );

    if (!context) {
      return null;
    }

    const result = await resolveTranscriptFetch(
      context.mediaUrl,
      process.env.YOUTUBE_TRANSCRIPT_IO_TOKEN ?? ''
    );
    const completion =
      result.status === 'failed'
        ? {
            errorCode: result.errorCode,
            message: result.message,
            retryAfter: result.retryAfter,
            status: 'failed' as const,
          }
        : {
            status: 'success' as const,
            text: result.text,
            wordCount: result.wordCount,
          };

    await ctx.runMutation(internal.talks.completeTalkTranscriptFetch, {
      ...completion,
      confirmRefetch: context.confirmRefetch,
      runId,
      talkId: context.talkId,
    });

    return null;
  },
  returns: v.null(),
});
