'use client';

import type { AnalyticsBrowser } from '@segment/analytics-next';

const writeKey = process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY;

interface LoadedAnalytics {
  browser: AnalyticsBrowser;
}

let clientPromise: Promise<LoadedAnalytics | undefined> | undefined;

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

export async function identify(
  userId: string,
  traits: {
    email?: string | null;
    name?: string | null;
    role?: string | null;
  }
) {
  const loaded = await getClient();

  if (!loaded) {
    return;
  }

  void loaded.browser.identify(userId, traits);
}

export function loadAnalytics() {
  void getClient();
}

export async function page(properties: { path: string; search: string }) {
  const loaded = await getClient();

  if (!loaded) {
    return;
  }

  void loaded.browser.page(properties);
}

export async function reset() {
  const loaded = await getClient();

  if (!loaded) {
    return;
  }

  void loaded.browser.reset();
}

export async function captureEvent(
  event: string,
  properties?: Record<string, unknown>
) {
  const loaded = await getClient();

  if (!loaded) {
    return;
  }

  void loaded.browser.track(event, properties);
}
