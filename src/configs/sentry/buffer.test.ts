import type { Scope } from '@sentry/nextjs';

import { afterEach, describe, expect, it } from '@/test';

import {
  bufferSentryEvent,
  drainSentryBuffer,
  flushSentryBuffer,
  SENTRY_BUFFER_LIMIT,
} from './buffer';

afterEach(() => {
  drainSentryBuffer();
});

describe('flushSentryBuffer', () => {
  it('sends buffered exceptions, messages, and unhandled errors', () => {
    const boom = new Error('boom');
    const rejected = new Error('rejected');
    const sentry = createFlushTarget();

    bufferSentryEvent({
      error: boom,
      kind: 'exception',
      options: { level: 'error' },
    });
    bufferSentryEvent({
      kind: 'message',
      message: 'hello',
      options: { level: 'warning' },
    });
    bufferSentryEvent({
      error: rejected,
      kind: 'unhandled',
    });

    flushSentryBuffer(sentry.target);

    expect(sentry.exceptions).toEqual([boom, rejected]);
    expect(sentry.messages).toEqual([{ level: 'warning', message: 'hello' }]);
    expect(drainSentryBuffer()).toEqual([]);
  });

  it('applies fingerprint, tags, and context when flushing', () => {
    const sentry = createFlushTarget();

    bufferSentryEvent({
      error: new Error('scoped'),
      kind: 'exception',
      options: {
        context: { href: '/talks' },
        fingerprint: ['media', 'thumbnail'],
        level: 'warning',
        tags: { feature: 'media' },
      },
    });

    flushSentryBuffer(sentry.target);

    expect(sentry.scopes).toEqual([
      {
        context: { href: '/talks' },
        extra: 'media|thumbnail',
        fingerprint: ['media', 'thumbnail'],
        level: 'warning',
        tags: { feature: 'media' },
      },
    ]);
  });

  it('sends a buffered string exception as a message', () => {
    const sentry = createFlushTarget();

    bufferSentryEvent({
      error: 'plain failure',
      kind: 'exception',
      options: {},
    });

    flushSentryBuffer(sentry.target);

    expect(sentry.exceptions).toEqual([]);
    expect(sentry.messages).toEqual([
      { level: undefined, message: 'plain failure' },
    ]);
  });

  it('drops events past the buffer limit and flushes the rest once', () => {
    const sentry = createFlushTarget();

    for (let index = 0; index < SENTRY_BUFFER_LIMIT + 5; index += 1) {
      bufferSentryEvent({
        error: new Error(`event-${index}`),
        kind: 'unhandled',
      });
    }

    flushSentryBuffer(sentry.target);
    flushSentryBuffer(sentry.target);

    expect(sentry.exceptions).toHaveLength(SENTRY_BUFFER_LIMIT);
    expect((sentry.exceptions[0] as Error).message).toBe('event-0');
    expect((sentry.exceptions[SENTRY_BUFFER_LIMIT - 1] as Error).message).toBe(
      `event-${SENTRY_BUFFER_LIMIT - 1}`
    );
  });
});

function createFlushTarget() {
  const exceptions: unknown[] = [];
  const messages: { level?: string; message: string }[] = [];
  const scopes: {
    context?: Record<string, unknown>;
    extra?: unknown;
    fingerprint?: string[];
    level?: string;
    tags?: Record<string, string>;
  }[] = [];

  return {
    exceptions,
    messages,
    scopes,
    target: {
      captureException: (error: unknown) => {
        exceptions.push(error);

        return 'exception-id';
      },
      captureMessage: (message: string, level?: string) => {
        messages.push({ level, message });

        return 'message-id';
      },
      // oxlint-disable-next-line promise/prefer-await-to-callbacks -- mirrors Sentry.withScope
      withScope: (run: (scope: Scope) => string | undefined) => {
        const recorded: (typeof scopes)[number] = {};
        const scope = {
          setContext: (_name: string, context: Record<string, unknown>) => {
            recorded.context = context;
          },
          setExtra: (_key: string, extra: unknown) => {
            recorded.extra = extra;
          },
          setFingerprint: (fingerprint: string[]) => {
            recorded.fingerprint = fingerprint;
          },
          setLevel: (level: string) => {
            recorded.level = level;
          },
          setTag: (key: string, value: string) => {
            recorded.tags = { ...recorded.tags, [key]: value };
          },
        } as Scope;

        scopes.push(recorded);

        return run(scope);
      },
    },
  };
}
