import { afterEach, describe, expect, it, vi } from 'vitest';

import { NO_TRANSCRIPT_SOURCE_MESSAGE } from '../summary/prompt';
import {
  fetchTranscript,
  toGenerateTranscriptEnsureFailure,
} from '../transcriptFetch';

const MEDIA_URL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

function mockResponse(status: number, body: unknown) {
  const fetchMock = vi.fn(() =>
    Promise.resolve(Response.json(body, { status }))
  );

  vi.stubGlobal('fetch', fetchMock);

  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('fetchTranscript', () => {
  it('posts the media url with a bearer token and returns the text', async () => {
    const fetchMock = mockResponse(200, { text: ' Hello world ' });

    await expect(fetchTranscript(MEDIA_URL, 'secret')).resolves.toEqual({
      status: 'success',
      text: 'Hello world',
    });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://transcripts.lukemcdonald.com/api/transcripts',
      expect.objectContaining({
        body: JSON.stringify({ url: MEDIA_URL }),
        headers: expect.objectContaining({ Authorization: 'Bearer secret' }),
        method: 'POST',
      })
    );
  });

  it('keeps the service error code and parses retryAfter', async () => {
    const retryAfter = '2026-12-01T00:00:00.000Z';

    mockResponse(429, { code: 'QUOTA_EXHAUSTED', message: 'x', retryAfter });

    await expect(fetchTranscript(MEDIA_URL, 'secret')).resolves.toMatchObject({
      errorCode: 'QUOTA_EXHAUSTED',
      retryAfter: Date.parse(retryAfter),
      status: 'failed',
    });
  });

  it('sends the job reference when resuming a job', async () => {
    const fetchMock = mockResponse(200, { text: 'Hello world' });

    await fetchTranscript(MEDIA_URL, 'secret', 'job-1');

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: JSON.stringify({ jobId: 'job-1', url: MEDIA_URL }),
      })
    );
  });

  it('returns a still-processing job as its own result, not a failure', async () => {
    const retryAfter = '2026-11-26T10:00:15.000Z';

    mockResponse(202, {
      code: 'PROCESSING',
      jobId: 'job-1',
      message: 'x',
      retryAfter,
    });

    await expect(fetchTranscript(MEDIA_URL, 'secret')).resolves.toEqual({
      jobId: 'job-1',
      retryAfter: Date.parse(retryAfter),
      status: 'processing',
    });
  });

  it('keeps an expired job reference as JOB_NOT_FOUND', async () => {
    mockResponse(404, { code: 'JOB_NOT_FOUND', message: 'x' });

    await expect(fetchTranscript(MEDIA_URL, 'secret', 'old')).resolves.toEqual({
      errorCode: 'JOB_NOT_FOUND',
      message: expect.any(String),
      status: 'failed',
    });
  });

  it('maps auth, unknown, and network failures', async () => {
    await expect(fetchTranscript(MEDIA_URL, '')).resolves.toMatchObject({
      errorCode: 'PROVIDER_AUTH_FAILED',
    });

    mockResponse(401, null);
    await expect(fetchTranscript(MEDIA_URL, 'bad')).resolves.toMatchObject({
      errorCode: 'PROVIDER_AUTH_FAILED',
    });

    mockResponse(400, { code: 'INVALID_REQUEST', message: 'x' });
    await expect(fetchTranscript(MEDIA_URL, 'secret')).resolves.toMatchObject({
      errorCode: 'PROVIDER_ERROR',
    });

    vi.stubGlobal('fetch', () => Promise.reject(new Error('offline')));
    await expect(fetchTranscript(MEDIA_URL, 'secret')).resolves.toMatchObject({
      errorCode: 'PROVIDER_ERROR',
    });
  });
});

describe('toGenerateTranscriptEnsureFailure', () => {
  it('keeps out of credits as a retryable upstream error', async () => {
    mockResponse(402, { code: 'QUOTA_EXCEEDED' });

    const result = await fetchTranscript(MEDIA_URL, 'secret');

    if (result.status !== 'failed') {
      throw new Error('expected a failed fetch');
    }

    expect(result.errorCode).toBe('QUOTA_EXCEEDED');
    expect(toGenerateTranscriptEnsureFailure(result)).toEqual({
      errorCode: 'UPSTREAM_ERROR',
      message: 'The transcript service is out of transcription credits.',
    });
  });

  it('treats an unsupported media URL as having no transcript source', async () => {
    mockResponse(422, { code: 'UNSUPPORTED_URL' });

    const result = await fetchTranscript('https://example.com/talk', 'secret');

    if (result.status !== 'failed') {
      throw new Error('expected a failed fetch');
    }

    expect(result.errorCode).toBe('UNSUPPORTED_URL');
    expect(toGenerateTranscriptEnsureFailure(result)).toEqual({
      errorCode: 'NO_TRANSCRIPT_SOURCE',
      message: NO_TRANSCRIPT_SOURCE_MESSAGE,
    });
  });
});
