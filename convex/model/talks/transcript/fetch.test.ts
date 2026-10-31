import { describe, expect, it } from 'vitest';

import {
  parseTranscriptApiVideo,
  toTranscriptHttpError,
} from '../transcriptFetch';
import { TRANSCRIPT_FETCH_ERROR_CODES } from '../validators';

const NOW = Date.UTC(2026, 9, 21, 12, 0, 0);

describe('transcript fetch error mapping', () => {
  it('maps HTTP and per-video API responses to error codes', () => {
    expect(toTranscriptHttpError(401, '', null, NOW).errorCode).toBe(
      TRANSCRIPT_FETCH_ERROR_CODES.TOKEN_INVALID
    );
    expect(toTranscriptHttpError(429, '', '10', NOW)).toMatchObject({
      errorCode: TRANSCRIPT_FETCH_ERROR_CODES.RATE_LIMITED,
      retryAfter: NOW + 10_000,
    });
    expect(toTranscriptHttpError(402, '', null, NOW).errorCode).toBe(
      TRANSCRIPT_FETCH_ERROR_CODES.QUOTA_EXHAUSTED
    );
    expect(
      toTranscriptHttpError(403, 'quota exceeded', null, NOW).errorCode
    ).toBe(TRANSCRIPT_FETCH_ERROR_CODES.QUOTA_EXHAUSTED);
    expect(parseTranscriptApiVideo({ isLoginRequired: true })).toMatchObject({
      errorCode: TRANSCRIPT_FETCH_ERROR_CODES.LOGIN_REQUIRED,
    });
    expect(parseTranscriptApiVideo({ tracks: [] })).toMatchObject({
      errorCode: TRANSCRIPT_FETCH_ERROR_CODES.NO_CAPTIONS,
    });
  });
});
