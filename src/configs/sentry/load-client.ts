import type * as SentrySdk from '@sentry/nextjs';

import { IS_DEV } from '../../constants/env';
import { bufferSentryEvent, flushSentryBuffer } from './buffer';
import { baseSentryConfig, IS_SENTRY_ENABLED } from './index';

const IDLE_TIMEOUT_MS = 4000;

type SentryClient = typeof SentrySdk;

let hasStartedClientSentryInit = false;
let loadPromise: Promise<SentryClient | null> | undefined;
let onError: ((event: ErrorEvent) => void) | undefined;
let onUnhandledRejection: ((event: PromiseRejectionEvent) => void) | undefined;
let sentryClient: SentryClient | null = null;

export function getClientSentry(): SentryClient | null {
  return sentryClient;
}

export function installClientSentryBuffer(): void {
  if (!IS_SENTRY_ENABLED || typeof window === 'undefined' || onError) {
    return;
  }

  onError = (event: ErrorEvent) => {
    if (hasStartedClientSentryInit || sentryClient) {
      return;
    }

    bufferSentryEvent({
      error: event.error ?? event.message,
      kind: 'unhandled',
    });
    void loadClientSentry();
  };

  onUnhandledRejection = (event: PromiseRejectionEvent) => {
    if (hasStartedClientSentryInit || sentryClient) {
      return;
    }

    bufferSentryEvent({
      error: event.reason,
      kind: 'unhandled',
    });
    void loadClientSentry();
  };

  window.addEventListener('error', onError);
  window.addEventListener('unhandledrejection', onUnhandledRejection);
}

export function loadClientSentry(): Promise<SentryClient | null> {
  if (!IS_SENTRY_ENABLED) {
    return Promise.resolve(null);
  }

  if (sentryClient) {
    return Promise.resolve(sentryClient);
  }

  loadPromise ??= initializeClientSentry();

  return loadPromise;
}

export function scheduleClientSentryLoad(): void {
  if (!IS_SENTRY_ENABLED || loadPromise || sentryClient) {
    return;
  }

  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(loadClientSentryInBackground, {
      timeout: IDLE_TIMEOUT_MS,
    });
    return;
  }

  setTimeout(loadClientSentryInBackground, IDLE_TIMEOUT_MS);
}

function loadClientSentryInBackground(): void {
  void loadClientSentry();
}

async function initializeClientSentry(): Promise<SentryClient | null> {
  try {
    const Sentry = await import('@sentry/nextjs');

    hasStartedClientSentryInit = true;
    uninstallClientSentryBuffer();

    if (typeof window !== 'undefined') {
      Sentry.init(baseSentryConfig);

      if (IS_DEV) {
        (window as unknown as { Sentry?: SentryClient }).Sentry = Sentry;
      }
    }

    sentryClient = Sentry;
    flushSentryBuffer(Sentry);

    return Sentry;
  } catch {
    hasStartedClientSentryInit = false;
    loadPromise = undefined;

    return null;
  }
}

function uninstallClientSentryBuffer(): void {
  if (typeof window === 'undefined' || !onError || !onUnhandledRejection) {
    return;
  }

  window.removeEventListener('error', onError);
  window.removeEventListener('unhandledrejection', onUnhandledRejection);
  onError = undefined;
  onUnhandledRejection = undefined;
}
