'use client';

import type { Analytics } from '@segment/analytics-next';

import { logAnalytics } from './log';
import { getPageContext, sanitizePageProperties } from './page-context';
import { privacyPlugin } from './privacy';

const writeKey = process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY;

let clientPromise: Promise<Analytics | undefined> | undefined;
let lastIdentifyKey: string | undefined;

async function loadClient(key: string) {
  try {
    const { AnalyticsBrowser } = await import('@segment/analytics-next');
    const [client] = await AnalyticsBrowser.load({
      plugins: [privacyPlugin],
      writeKey: key,
    });
    return client;
  } catch (error: unknown) {
    clientPromise = undefined;
    console.error('[analytics]: failed to load', error);
  }
}

function getClient() {
  if (!writeKey) {
    return Promise.resolve();
  }
  clientPromise ??= loadClient(writeKey);
  return clientPromise;
}

async function dispatch(run: (client: Analytics) => unknown) {
  try {
    const client = await getClient();
    if (client) {
      await run(client);
    }
  } catch (error: unknown) {
    console.error('[analytics]', error);
  }
}

function resetUser(client: Analytics, nextUserId: string | null = null) {
  const previousId = client.user().id();
  if (previousId && previousId !== nextUserId) {
    logAnalytics('reset');
    client.reset();
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
  const key = JSON.stringify({ ...traits, userId });
  const options = {
    context: { page: getPageContext() },
    timestamp: new Date(),
  };
  return dispatch(async (client) => {
    if (lastIdentifyKey === key) {
      return;
    }
    resetUser(client, userId);
    logAnalytics('identify', { userId });
    await client.identify(userId, traits, options);
    lastIdentifyKey = key;
  });
}

export function loadAnalytics() {
  void getClient();
}

export function page() {
  const properties = getPageContext();
  const options = { context: { page: properties }, timestamp: new Date() };
  logAnalytics('page', properties);
  return dispatch((client) => client.page(properties, options));
}

/** Clear stale signed-in identity without rotating an anonymous visitor's ID. */
export function reset() {
  return dispatch((client) => {
    lastIdentifyKey = undefined;
    resetUser(client);
  });
}

export function captureEvent(
  event: string,
  properties?: Record<string, unknown>
) {
  const sanitized = properties ? sanitizePageProperties(properties) : undefined;
  const options = {
    context: { page: getPageContext() },
    timestamp: new Date(),
  };
  logAnalytics(event, sanitized);
  return dispatch((client) => client.track(event, sanitized, options));
}

/** Give redirect-bound events a bounded delivery window without blocking auth. */
export async function waitForAnalytics(event: Promise<void>) {
  const timeout = Promise.withResolvers<null>();
  const timer = setTimeout(() => timeout.resolve(null), 500);
  try {
    await Promise.race([event, timeout.promise]);
  } finally {
    clearTimeout(timer);
  }
}
