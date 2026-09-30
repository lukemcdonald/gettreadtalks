'use client';

import type { AnalyticsBrowser } from '@segment/analytics-next';

import { logAnalytics } from './log';

const writeKey = process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY;

interface LoadedAnalytics {
  browser: AnalyticsBrowser;
}

let clientPromise: Promise<LoadedAnalytics | undefined> | undefined;
let dispatchQueue: Promise<void> = Promise.resolve();
let lastIdentifyKey: string | undefined;

async function loadClient(key: string): Promise<LoadedAnalytics | undefined> {
  try {
    const { AnalyticsBrowser } = await import('@segment/analytics-next');
    const browser = AnalyticsBrowser.load({ writeKey: key });

    void (async () => {
      try {
        await browser;
      } catch (error: unknown) {
        console.error('[analytics]: failed to load', error);
        clientPromise = undefined;
      }
    })();

    return { browser };
  } catch (error: unknown) {
    console.error('[analytics]: failed to load', error);
    clientPromise = undefined;
  }
}

function getClient(): Promise<LoadedAnalytics | undefined> {
  const key = writeKey;

  if (!key) {
    return Promise.resolve(undefined as LoadedAnalytics | undefined);
  }

  if (!clientPromise) {
    clientPromise = loadClient(key);
  }

  return clientPromise;
}

function enqueue(task: () => Promise<void>): Promise<void> {
  const run = dispatchQueue.then(task, task);

  dispatchQueue = run.then(
    () => {},
    () => {}
  );

  return run;
}

async function dispatch(run: (browser: AnalyticsBrowser) => Promise<unknown>) {
  try {
    const loaded = await getClient();

    if (!loaded) {
      return;
    }

    await run(loaded.browser);
  } catch (error: unknown) {
    console.error('[analytics]', error);
  }
}

export function identify(
  userId: string,
  traits: {
    email?: string | null;
    name?: string | null;
    role?: string | null;
  }
) {
  const key = JSON.stringify({
    email: traits.email ?? '',
    name: traits.name ?? '',
    role: traits.role ?? '',
    userId,
  });

  if (lastIdentifyKey === key) {
    return Promise.resolve();
  }

  lastIdentifyKey = key;
  logAnalytics('identify', { userId });

  return enqueue(() => dispatch((browser) => browser.identify(userId, traits)));
}

export function loadAnalytics() {
  void getClient();
}

export function page() {
  logAnalytics('page');

  return enqueue(() => dispatch((browser) => browser.page()));
}

export function reset() {
  lastIdentifyKey = undefined;
  logAnalytics('reset');

  return enqueue(() => dispatch((browser) => Promise.resolve(browser.reset())));
}

export function captureEvent(
  event: string,
  properties?: Record<string, unknown>
) {
  logAnalytics(event, properties);

  return enqueue(() => dispatch((browser) => browser.track(event, properties)));
}
