import type * as SentrySdk from '@sentry/nextjs';

import { IS_DEV } from '../../constants/env';
import { baseSentryConfig, IS_SENTRY_ENABLED } from './index';

export const SENTRY_BUFFER_LIMIT = 64;

type SentryClient = typeof SentrySdk;
type SentryCapture = (client: SentryClient) => void;

const queue: SentryCapture[] = [];

let loadPromise: Promise<SentryClient | null> | undefined;
let sentry: SentryClient | null = null;
let started = false;

export function bufferSentryCapture(capture: SentryCapture): void {
  if (queue.length < SENTRY_BUFFER_LIMIT) {
    queue.push(capture);
  }
}

export function drainSentryQueue(): void {
  queue.length = 0;
}

export function enqueueSentryCapture(
  capture: (client: SentryClient) => string | undefined
): string | undefined {
  if (!IS_SENTRY_ENABLED) {
    return undefined;
  }

  if (sentry) {
    return capture(sentry);
  }

  bufferSentryCapture(capture);
  void loadClientSentry();

  return undefined;
}

export function flushSentryQueue(client: SentryClient): void {
  for (const capture of queue.splice(0)) {
    capture(client);
  }
}

export function getClientSentry(): SentryClient | null {
  return sentry;
}

export function startClientSentry(): void {
  if (!IS_SENTRY_ENABLED || typeof window === 'undefined') {
    return;
  }

  window.addEventListener('error', onWindowError);
  window.addEventListener('unhandledrejection', onUnhandledRejection);
  void loadClientSentry(true);
}

function bufferWindowError(error: unknown): void {
  if (started) {
    return;
  }

  bufferSentryCapture((client) => {
    client.captureException(error);
  });
  void loadClientSentry();
}

async function initClientSentry(): Promise<SentryClient | null> {
  try {
    const Sentry = await import('@sentry/nextjs');

    started = true;

    if (typeof window !== 'undefined') {
      Sentry.init(baseSentryConfig);

      if (IS_DEV) {
        (window as unknown as { Sentry?: SentryClient }).Sentry = Sentry;
      }
    }

    sentry = Sentry;
    flushSentryQueue(Sentry);

    return Sentry;
  } catch {
    started = false;
    loadPromise = undefined;

    return null;
  }
}

function loadClientSentry(idle = false): Promise<SentryClient | null> {
  if (!IS_SENTRY_ENABLED || sentry) {
    return Promise.resolve(sentry);
  }

  if (idle && !loadPromise) {
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(loadNow, { timeout: 4000 });
    } else {
      setTimeout(loadNow, 4000);
    }

    return Promise.resolve(null);
  }

  loadPromise ??= initClientSentry();

  return loadPromise;
}

function loadNow(): void {
  void loadClientSentry();
}

function onUnhandledRejection(event: PromiseRejectionEvent): void {
  bufferWindowError(event.reason);
}

function onWindowError(event: ErrorEvent): void {
  bufferWindowError(event.error ?? event.message);
}
