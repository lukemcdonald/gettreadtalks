import type { Scope, SeverityLevel } from '@sentry/nextjs';

export const SENTRY_BUFFER_LIMIT = 64;

export interface BufferedCaptureOptions {
  context?: Record<string, unknown>;
  fingerprint?: string[];
  level?: SeverityLevel;
  tags?: Record<string, string>;
}

export type BufferedSentryEvent =
  | {
      error: unknown;
      kind: 'exception';
      options: BufferedCaptureOptions;
    }
  | {
      error: unknown;
      kind: 'unhandled';
    }
  | {
      kind: 'message';
      message: string;
      options: BufferedCaptureOptions;
    };

export interface SentryFlushTarget {
  captureException: (error: unknown) => string | undefined;
  captureMessage: (
    message: string,
    level?: SeverityLevel
  ) => string | undefined;
  withScope: (
    callback: (scope: Scope) => string | undefined
  ) => string | undefined;
}

const buffer: BufferedSentryEvent[] = [];

export function applyCaptureOptions(
  scope: Scope,
  options: BufferedCaptureOptions,
  fallbackLevel: SeverityLevel
): void {
  const { context, fingerprint, level = fallbackLevel, tags } = options;

  scope.setLevel(level);

  if (context) {
    scope.setContext('Details', context);
  }

  if (fingerprint) {
    const clean = fingerprint.filter(Boolean);
    scope.setFingerprint(clean);
    scope.setExtra('fingerprint', clean.join('|'));
  }

  if (tags) {
    for (const [key, value] of Object.entries(tags)) {
      scope.setTag(key, value);
    }
  }
}

export function bufferSentryEvent(event: BufferedSentryEvent): void {
  if (buffer.length >= SENTRY_BUFFER_LIMIT) {
    return;
  }

  buffer.push(event);
}

export function drainSentryBuffer(): BufferedSentryEvent[] {
  return buffer.splice(0);
}

export function flushSentryBuffer(sentry: SentryFlushTarget): void {
  for (const event of drainSentryBuffer()) {
    switch (event.kind) {
      case 'exception': {
        sentry.withScope((scope) => {
          applyCaptureOptions(scope, event.options, 'error');

          if (typeof event.error === 'string') {
            return sentry.captureMessage(event.error);
          }

          return sentry.captureException(event.error);
        });
        break;
      }
      case 'message': {
        sentry.withScope((scope) => {
          applyCaptureOptions(scope, event.options, 'info');

          return sentry.captureMessage(
            event.message,
            event.options.level ?? 'info'
          );
        });
        break;
      }
      case 'unhandled': {
        sentry.captureException(event.error);
        break;
      }
      default: {
        break;
      }
    }
  }
}
