'use client';

import { useEffect, useLayoutEffect } from 'react';

import { authClient } from '@/services/auth/client';
import {
  getSessionCookiePresence,
  isBetterAuthSessionBroadcast,
  setSessionCookiePresence,
} from '@/services/auth/session-presence-store';

export function SessionCookiePresence({ hasSession }: { hasSession: boolean }) {
  useLayoutEffect(() => {
    if (hasSession) {
      setSessionCookiePresence(true);
      void authClient.getSession();

      return;
    }

    if (getSessionCookiePresence() !== true) {
      setSessionCookiePresence(false);
    }
  }, [hasSession]);

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (!isBetterAuthSessionBroadcast(event.key, event.newValue)) {
        return;
      }

      setSessionCookiePresence(true);
      void authClient.getSession();
    }

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return null;
}
