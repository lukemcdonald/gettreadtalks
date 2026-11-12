import { describe, expect, it } from '@/test';

import {
  isBetterAuthSessionBroadcast,
  setSessionCookiePresence,
  waitForSessionCookiePresence,
} from './session-presence-store';

describe('isBetterAuthSessionBroadcast', () => {
  it('is true for a Better Auth session message', () => {
    expect(
      isBetterAuthSessionBroadcast(
        'better-auth.message',
        JSON.stringify({
          data: { trigger: 'signin' },
          event: 'session',
        })
      )
    ).toBe(true);
  });

  it('is false for other storage keys and payloads', () => {
    expect(isBetterAuthSessionBroadcast('theme', '{"event":"session"}')).toBe(
      false
    );
    expect(
      isBetterAuthSessionBroadcast(
        'better-auth.message',
        JSON.stringify({ event: 'other' })
      )
    ).toBe(false);
    expect(isBetterAuthSessionBroadcast('better-auth.message', '{')).toBe(
      false
    );
  });
});

describe('waitForSessionCookiePresence', () => {
  it('resolves with the known presence', async () => {
    setSessionCookiePresence(true);

    await expect(waitForSessionCookiePresence()).resolves.toBe(true);

    setSessionCookiePresence(false);

    await expect(waitForSessionCookiePresence()).resolves.toBe(false);
  });
});
