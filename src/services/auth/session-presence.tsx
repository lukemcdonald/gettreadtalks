'use client';

import { useLayoutEffect } from 'react';

import { authClient } from '@/services/auth/client';
import { setSessionCookiePresence } from '@/services/auth/session-presence-store';

export function SessionCookiePresence({ hasSession }: { hasSession: boolean }) {
  useLayoutEffect(() => {
    setSessionCookiePresence(hasSession);

    if (hasSession) {
      void authClient.getSession();
    }
  }, [hasSession]);

  return null;
}
