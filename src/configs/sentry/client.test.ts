import type * as Sentry from '@sentry/nextjs';

import { afterEach, describe, expect, it, vi } from '@/test';

import {
  bufferSentryCapture,
  drainSentryQueue,
  flushSentryQueue,
  SENTRY_BUFFER_LIMIT,
} from './client';

describe('sentry client queue', () => {
  const MOCK_ERROR = new Error('boom');
  const MOCK_OVERFLOW = 5;

  afterEach(() => {
    drainSentryQueue();
  });

  it('flushes buffered captures', () => {
    const captureException = vi.fn();

    bufferSentryCapture((client) => {
      client.captureException(MOCK_ERROR);
    });
    flushSentryQueue({ captureException } as unknown as typeof Sentry);

    expect(captureException).toHaveBeenCalledTimes(1);
    expect(captureException).toHaveBeenCalledWith(MOCK_ERROR);
  });

  it('drops captures past the buffer cap', () => {
    const captureException = vi.fn();
    const sentry = { captureException } as unknown as typeof Sentry;

    for (
      let index = 0;
      index < SENTRY_BUFFER_LIMIT + MOCK_OVERFLOW;
      index += 1
    ) {
      const value = index;

      bufferSentryCapture((client) => {
        client.captureException(value);
      });
    }

    flushSentryQueue(sentry);
    flushSentryQueue(sentry);

    expect(captureException).toHaveBeenCalledTimes(SENTRY_BUFFER_LIMIT);
    expect(captureException).toHaveBeenNthCalledWith(1, 0);
    expect(captureException).toHaveBeenNthCalledWith(
      SENTRY_BUFFER_LIMIT,
      SENTRY_BUFFER_LIMIT - 1
    );
  });
});
