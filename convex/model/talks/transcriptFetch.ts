import { v } from 'convex/values';

import { internal } from '../../_generated/api';
import { internalAction } from '../../_generated/server';

const YOUTUBE_TRANSCRIPT_API_URL =
  'https://www.youtube-transcript.io/api/transcripts';
const YOUTUBE_ID_PATTERNS = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)(?<id>[^&\n?#]+)/u,
  /youtube\.com\/watch\?.*v=(?<id>[^&\n?#]+)/u,
];

const TRANSCRIPT_FETCH_MESSAGES = {
  login_required: 'YouTube requires a login to view this talk.',
  no_captions: 'No captions are available for this talk.',
  not_youtube: 'Transcripts can only be fetched from YouTube talks.',
  quota_exhausted: 'The monthly transcript quota has been used up.',
  rate_limited: 'Too many transcript requests.',
  token_invalid: 'Transcript service rejected the request.',
  token_missing: 'Transcript service is not configured.',
} as const;

type TranscriptFetchErrorCode =
  | 'login_required'
  | 'no_captions'
  | 'not_youtube'
  | 'quota_exhausted'
  | 'rate_limited'
  | 'token_invalid'
  | 'token_missing'
  | 'upstream_error';

interface TranscriptFetchFailure {
  errorCode: TranscriptFetchErrorCode;
  message: string;
  retryAfter?: number;
  status: 'failed';
}

type TranscriptFetchResult =
  | TranscriptFetchFailure
  | { status: 'success'; text: string };

function parseYouTubeVideoId(url: string) {
  for (const pattern of YOUTUBE_ID_PATTERNS) {
    const match = url.match(pattern);

    if (match?.groups?.id) {
      return match.groups.id;
    }
  }

  return null;
}

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
      errorCode: 'rate_limited',
      message: TRANSCRIPT_FETCH_MESSAGES.rate_limited,
      retryAfter: parseRetryAfter(retryAfterHeader, nowMs),
      status: 'failed',
    };
  }

  if (
    status === 402 ||
    /credit|limit exceeded|limit reached|quota/iu.test(body)
  ) {
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
      errorCode: 'upstream_error',
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
      errorCode: 'login_required',
      message: TRANSCRIPT_FETCH_MESSAGES.login_required,
      status: 'failed',
    };
  }

  const text = getVideoText(video)
    .replaceAll(/\[(?:[^\]]+)\]/gu, ' ')
    .replaceAll(/\s+/gu, ' ')
    .trim();

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

  try {
    const parsed: unknown = JSON.parse(body);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return {
        errorCode: 'no_captions',
        message: TRANSCRIPT_FETCH_MESSAGES.no_captions,
        status: 'failed',
      };
    }

    return parseTranscriptApiVideo(parsed[0]);
  } catch {
    return {
      errorCode: 'upstream_error',
      message: 'Transcript service returned an error (HTTP 200).',
      status: 'failed',
    };
  }
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

export const fetchTalkTranscript = internalAction({
  args: {
    mediaUrl: v.string(),
    runId: v.id('talkTranscriptFetches'),
    talkId: v.id('talks'),
  },
  handler: async (ctx, args) => {
    const result = await resolveTranscriptFetch(
      args.mediaUrl,
      process.env.YOUTUBE_TRANSCRIPT_IO_TOKEN ?? ''
    );

    await ctx.runMutation(internal.talks.completeTalkTranscriptFetch, {
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
      runId: args.runId,
      talkId: args.talkId,
    });

    return null;
  },
  returns: v.null(),
});
