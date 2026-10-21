import { describe, expect, it } from 'vitest';

import {
  getQuotaResetAt,
  getTranscriptWordCount,
  loadYoutubeTranscript,
  parseRetryAfter,
  parseTranscriptApiVideo,
  parseYouTubeVideoId,
  stripTranscriptTags,
  toTranscriptHttpError,
  TRANSCRIPT_FETCH_MESSAGES,
  TRANSCRIPT_QUOTA_RESET_DAY,
} from './transcriptFetch';

const NOW = Date.UTC(2026, 9, 21, 12, 0, 0);

function jsonResponse(
  body: unknown,
  status = 200,
  headers?: Record<string, string>
) {
  return Response.json(body, { headers, status });
}

describe('parseYouTubeVideoId', () => {
  it('reads watch, share, and embed URLs and skips other media', () => {
    expect(
      parseYouTubeVideoId('https://www.youtube.com/watch?v=jNQXAC9IVRw')
    ).toBe('jNQXAC9IVRw');
    expect(parseYouTubeVideoId('https://youtu.be/jNQXAC9IVRw')).toBe(
      'jNQXAC9IVRw'
    );
    expect(
      parseYouTubeVideoId('https://www.youtube.com/embed/jNQXAC9IVRw')
    ).toBe('jNQXAC9IVRw');
    expect(parseYouTubeVideoId('https://vimeo.com/123456789')).toBeNull();
    expect(parseYouTubeVideoId('https://cdn.example.com/talk.mp3')).toBeNull();
  });
});

describe('stripTranscriptTags and word count', () => {
  it('removes bracket tags and counts the remaining words', () => {
    const text = stripTranscriptTags('[Music] Grace is a gift [Applause]');

    expect(text).toBe('Grace is a gift');
    expect(getTranscriptWordCount(text)).toBe(4);
  });
});

describe('retry timing', () => {
  it('uses Retry-After seconds or a date, and the next monthly reset', () => {
    expect(parseRetryAfter('30', NOW)).toBe(NOW + 30_000);
    expect(parseRetryAfter('Wed, 21 Oct 2026 12:01:00 GMT', NOW)).toBe(
      Date.UTC(2026, 9, 21, 12, 1, 0)
    );
    expect(getQuotaResetAt(NOW, TRANSCRIPT_QUOTA_RESET_DAY)).toBe(
      Date.UTC(2026, 10, 21)
    );
    expect(getQuotaResetAt(Date.UTC(2026, 9, 10), 21)).toBe(
      Date.UTC(2026, 9, 21)
    );
  });
});

describe('toTranscriptHttpError', () => {
  it('maps HTTP statuses and quota language', () => {
    expect(toTranscriptHttpError(401, '', null, NOW)).toEqual({
      errorCode: 'token_invalid',
      message: TRANSCRIPT_FETCH_MESSAGES.token_invalid,
      status: 'failed',
    });
    expect(toTranscriptHttpError(429, 'slow down', '10', NOW)).toEqual({
      errorCode: 'rate_limited',
      message: TRANSCRIPT_FETCH_MESSAGES.rate_limited,
      retryAfter: NOW + 10_000,
      status: 'failed',
    });
    expect(toTranscriptHttpError(403, 'quota exceeded', null, NOW)).toEqual({
      errorCode: 'quota_exhausted',
      message: TRANSCRIPT_FETCH_MESSAGES.quota_exhausted,
      retryAfter: Date.UTC(2026, 10, 21),
      status: 'failed',
    });
    expect(toTranscriptHttpError(503, '', null, NOW)).toEqual({
      errorCode: 'upstream_error',
      message: 'Transcript service returned an error (HTTP 503).',
      status: 'failed',
    });
  });
});

describe('parseTranscriptApiVideo', () => {
  it('prefers full text, strips tags, and maps per-video failures', () => {
    expect(
      parseTranscriptApiVideo({
        text: '[Music] Grace is a gift',
        tracks: [{ transcript: [{ text: 'ignored' }] }],
      })
    ).toEqual({
      status: 'success',
      text: 'Grace is a gift',
      wordCount: 4,
    });
    expect(
      parseTranscriptApiVideo({
        tracks: [
          {
            transcript: [{ text: '[Music]' }, { text: 'Hello world' }],
          },
        ],
      })
    ).toEqual({
      status: 'success',
      text: 'Hello world',
      wordCount: 2,
    });
    expect(
      parseTranscriptApiVideo({
        isLoginRequired: true,
        playabilityStatus: { reason: 'login required' },
      })
    ).toEqual({
      errorCode: 'login_required',
      message: TRANSCRIPT_FETCH_MESSAGES.login_required,
      status: 'failed',
    });
    expect(parseTranscriptApiVideo({ tracks: [] })).toEqual({
      errorCode: 'no_captions',
      message: TRANSCRIPT_FETCH_MESSAGES.no_captions,
      status: 'failed',
    });
  });
});

describe('loadYoutubeTranscript', () => {
  it('maps a successful payload and HTTP failures without a live request', async () => {
    const ok = await loadYoutubeTranscript(
      'jNQXAC9IVRw',
      'token',
      () =>
        Promise.resolve(
          jsonResponse([
            {
              id: 'jNQXAC9IVRw',
              text: '[Music] Grace is a gift',
            },
          ])
        ),
      NOW
    );
    const limited = await loadYoutubeTranscript(
      'jNQXAC9IVRw',
      'token',
      () =>
        Promise.resolve(
          jsonResponse({ error: 'slow down' }, 429, { 'Retry-After': '15' })
        ),
      NOW
    );

    expect(ok).toEqual({
      status: 'success',
      text: 'Grace is a gift',
      wordCount: 4,
    });
    expect(limited).toEqual({
      errorCode: 'rate_limited',
      message: TRANSCRIPT_FETCH_MESSAGES.rate_limited,
      retryAfter: NOW + 15_000,
      status: 'failed',
    });
  });
});
