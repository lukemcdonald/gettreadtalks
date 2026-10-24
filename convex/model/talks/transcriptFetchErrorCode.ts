export const TRANSCRIPT_FETCH_ERROR_CODES = {
  LOGIN_REQUIRED: 'LOGIN_REQUIRED',
  NO_CAPTIONS: 'NO_CAPTIONS',
  NOT_YOUTUBE: 'NOT_YOUTUBE',
  QUOTA_EXHAUSTED: 'QUOTA_EXHAUSTED',
  RATE_LIMITED: 'RATE_LIMITED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  TOKEN_MISSING: 'TOKEN_MISSING',
  UPSTREAM_ERROR: 'UPSTREAM_ERROR',
} as const;

const TRANSCRIPT_FETCH_ERROR_CODE_RENAMES = {
  login_required: TRANSCRIPT_FETCH_ERROR_CODES.LOGIN_REQUIRED,
  no_captions: TRANSCRIPT_FETCH_ERROR_CODES.NO_CAPTIONS,
  not_youtube: TRANSCRIPT_FETCH_ERROR_CODES.NOT_YOUTUBE,
  quota_exhausted: TRANSCRIPT_FETCH_ERROR_CODES.QUOTA_EXHAUSTED,
  rate_limited: TRANSCRIPT_FETCH_ERROR_CODES.RATE_LIMITED,
  token_invalid: TRANSCRIPT_FETCH_ERROR_CODES.TOKEN_INVALID,
  token_missing: TRANSCRIPT_FETCH_ERROR_CODES.TOKEN_MISSING,
  upstream_error: TRANSCRIPT_FETCH_ERROR_CODES.UPSTREAM_ERROR,
} as const;

export type TranscriptFetchErrorCode =
  (typeof TRANSCRIPT_FETCH_ERROR_CODES)[keyof typeof TRANSCRIPT_FETCH_ERROR_CODES];

type LegacyTranscriptFetchErrorCode =
  keyof typeof TRANSCRIPT_FETCH_ERROR_CODE_RENAMES;

export function isLegacyTranscriptFetchErrorCode(
  errorCode: string
): errorCode is LegacyTranscriptFetchErrorCode {
  return errorCode in TRANSCRIPT_FETCH_ERROR_CODE_RENAMES;
}

export function normalizeTranscriptFetchErrorCode(errorCode: string) {
  if (isLegacyTranscriptFetchErrorCode(errorCode)) {
    return TRANSCRIPT_FETCH_ERROR_CODE_RENAMES[errorCode];
  }

  return errorCode as TranscriptFetchErrorCode;
}
