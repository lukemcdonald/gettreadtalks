import { describe, expect, it } from 'vitest';

import {
  parseTranscriptApiVideo,
  toTranscriptHttpError,
} from './transcriptFetch';

const NOW = Date.UTC(2026, 9, 21, 12, 0, 0);

describe('transcript fetch error mapping', () => {
  it('maps HTTP and per-video API responses to error codes', () => {
    expect(toTranscriptHttpError(401, '', null, NOW).errorCode).toBe(
      'token_invalid'
    );
    expect(toTranscriptHttpError(429, '', '10', NOW)).toMatchObject({
      errorCode: 'rate_limited',
      retryAfter: NOW + 10_000,
    });
    expect(toTranscriptHttpError(402, '', null, NOW).errorCode).toBe(
      'quota_exhausted'
    );
    expect(
      toTranscriptHttpError(403, 'quota exceeded', null, NOW).errorCode
    ).toBe('quota_exhausted');
    expect(parseTranscriptApiVideo({ isLoginRequired: true })).toMatchObject({
      errorCode: 'login_required',
    });
    expect(parseTranscriptApiVideo({ tracks: [] })).toMatchObject({
      errorCode: 'no_captions',
    });
  });
});
