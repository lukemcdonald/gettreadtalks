'use client';

import type { Analytics } from '@segment/analytics-next';

import { logAnalytics } from './log';
import { getPageContext, sanitizePageProperties } from './page-context';

const writeKey = process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY;

let clientPromise: Promise<Analytics | undefined> | undefined;
let dispatchQueue: Promise<void> = Promise.resolve();
let lastIdentifyKey: string | undefined;

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
  if (!writeKey) {
    return Promise.resolve();
  }

  if (!clientPromise) {
    clientPromise = loadClient(writeKey);
  }

  return clientPromise;
}

function enqueue(task: () => Promise<void>) {
  const run = dispatchQueue.then(task, task);

  dispatchQueue = run.then(
    () => {},
    () => {}
  );

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

export function captureEvent(
  event: string,
  properties?: Record<string, unknown>
) {
  const sanitized = properties ? sanitizePageProperties(properties) : undefined;

  logAnalytics(event, sanitized);

  return enqueue(() => dispatch((client) => client.track(event, sanitized)));
}

export async function waitForAnalytics(event: Promise<void>) {
  const timeout = Promise.withResolvers<null>();
  const timer = setTimeout(() => timeout.resolve(null), 500);

  try {
    await Promise.race([event, timeout.promise]);
  } finally {
    clearTimeout(timer);
  }
}
