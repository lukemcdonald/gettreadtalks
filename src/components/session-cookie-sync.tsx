import { navigation } from 'next/cache';

import { hasSessionCookie } from '@/services/auth/server';
import { SessionCookiePresence } from '@/services/auth/session-presence';

export async function SessionCookieSync() {
  await navigation();

  return <SessionCookiePresence hasSession={await hasSessionCookie()} />;
}
