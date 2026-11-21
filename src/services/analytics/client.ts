'use client';

import type { Analytics } from '@segment/analytics-next';

import { isSegmentEnabled } from './enabled';
import { logAnalytics } from './log';
import { getPageContext, sanitizePageProperties } from './page-context';

const IDLE_LOAD_TIMEOUT_MS = 2000;
const writeKey = process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY;
const segmentEnabled = isSegmentEnabled(
  writeKey,
  process.env.NEXT_PUBLIC_SEGMENT_ENABLED
);

let clientPromise: Promise<Analytics | undefined> | undefined;
let dispatchQueue: Promise<void> = Promise.resolve();
let idleLoad: Promise<null> | undefined;
let lastIdentifyKey: string | undefined;

function scheduleIdleLoad() {
  if (idleLoad) {
    return idleLoad;
  }

  // oxlint-disable-next-line promise/avoid-new -- Promise.withResolvers is missing in older browsers and crawlers.
  idleLoad = new Promise<null>((resolve) => {
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(() => resolve(null), {
        timeout: IDLE_LOAD_TIMEOUT_MS,
      });
    } else {
      setTimeout(() => resolve(null), IDLE_LOAD_TIMEOUT_MS);
    }
  });

  return idleLoad;
}

async function loadClient(key: string) {
  try {
    const { AnalyticsBrowser } = await import('@segment/analytics-next');
    const [client] = await AnalyticsBrowser.load({ writeKey: key });

    return client;
  } catch (error: unknown) {
    clientPromise = undefined;
    console.error('[analytics]: failed to load', error);
  }
}

function getClient() {
  if (!segmentEnabled || !writeKey) {
    return Promise.resolve();
  }

  if (!clientPromise) {
    clientPromise = scheduleIdleLoad().then(() => loadClient(writeKey));
  }

  return clientPromise;
}

function enqueue(task: () => Promise<void>) {
  const run = dispatchQueue.catch(() => {}).then(task);

  dispatchQueue = run.catch(() => {});

  return run;
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

async function resetUser(client: Analytics, nextUserId: string | null = null) {
  const previousId = client.user().id();

  if (previousId && previousId !== nextUserId) {
    logAnalytics('reset');
    await client.reset();
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

  return enqueue(() =>
    dispatch(async (client) => {
      if (lastIdentifyKey === key) {
        return;
      }

      await resetUser(client, userId);
      logAnalytics('identify', { userId });
      await client.identify(userId, traits);
      lastIdentifyKey = key;
    })
  );
}

export function loadAnalytics() {
  void getClient();
}

export function page() {
  const properties = getPageContext();

  logAnalytics('page', properties);

  return enqueue(() => dispatch((client) => client.page(properties)));
}

export function reset() {
  return enqueue(() =>
    dispatch(async (client) => {
      lastIdentifyKey = undefined;
      await resetUser(client);
    })
  );
}

export function trackEvent(
  event: string,
  properties?: Record<string, unknown>
) {
  const sanitized = properties ? sanitizePageProperties(properties) : undefined;

  logAnalytics(event, sanitized);

  return enqueue(() => dispatch((client) => client.track(event, sanitized)));
}

export async function waitForAnalytics(event: Promise<void>) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  // oxlint-disable-next-line promise/avoid-new -- Promise.withResolvers is missing in older browsers.
  const timeout = new Promise<null>((resolve) => {
    timer = setTimeout(() => resolve(null), 500);
  });

  try {
    await Promise.race([event, timeout]);
  } finally {
    clearTimeout(timer);
  }
}
