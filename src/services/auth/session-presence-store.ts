'use client';

import { useSyncExternalStore } from 'react';

const BETTER_AUTH_BROADCAST_KEY = 'better-auth.message';

let sessionCookiePresence: boolean | null = null;
const listeners = new Set<() => void>();

export function getSessionCookiePresence() {
  return sessionCookiePresence;
}

export function setSessionCookiePresence(hasSession: boolean) {
  if (sessionCookiePresence === hasSession) {
    return;
  }

  sessionCookiePresence = hasSession;

  for (const listener of listeners) {
    listener();
  }
}

function subscribeSessionCookiePresence(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function useSessionCookiePresence() {
  return useSyncExternalStore(
    subscribeSessionCookiePresence,
    getSessionCookiePresence,
    () => null
  );
}

export async function waitForSessionCookiePresence() {
  const current = getSessionCookiePresence();

  if (current !== null) {
    return current;
  }

  const { promise, resolve } = Promise.withResolvers<boolean>();
  const unsubscribe = subscribeSessionCookiePresence(() => {
    const next = getSessionCookiePresence();

    if (next === null) {
      return;
    }

    unsubscribe();
    resolve(next);
  });
  const next = getSessionCookiePresence();

  if (next !== null) {
    unsubscribe();
    resolve(next);
  }

  return await promise;
}

export function isBetterAuthSessionBroadcast(
  key: string | null,
  value: string | null
) {
  if (key !== BETTER_AUTH_BROADCAST_KEY || !value) {
    return false;
  }

  try {
    const message = JSON.parse(value) as { event?: string };

    return message.event === 'session';
  } catch {
    return false;
  }
}

export function broadcastSessionCookiePresence() {
  setSessionCookiePresence(true);

  try {
    localStorage.setItem(
      BETTER_AUTH_BROADCAST_KEY,
      JSON.stringify({
        clientId: Math.random().toString(36).slice(2),
        data: { trigger: 'signin' },
        event: 'session',
        timestamp: Math.floor(Date.now() / 1000),
      })
    );
  } catch {
    // localStorage can throw in private mode.
  }
}
