'use client';

import { useSyncExternalStore } from 'react';

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
