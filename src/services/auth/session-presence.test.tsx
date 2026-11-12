/// <reference types="vitest/globals" />

import { describe, expect, it, render, screen, waitFor } from '@/test';

import { SessionCookiePresence } from './session-presence';
import {
  setSessionCookiePresence,
  useSessionCookiePresence,
} from './session-presence-store';

vi.mock('@/services/auth/client', () => ({
  authClient: {
    getSession: vi.fn(() => Promise.resolve({ data: null })),
  },
}));

function PresenceValue() {
  const presence = useSessionCookiePresence();

  return <span data-testid="session-presence">{String(presence)}</span>;
}

describe('SessionCookiePresence', () => {
  it('treats the visitor as signed out when the server found no session cookie', async () => {
    setSessionCookiePresence(false);

    render(
      <>
        <PresenceValue />
        <SessionCookiePresence hasSession={false} />
      </>
    );

    await waitFor(() => {
      expect(screen.getByTestId('session-presence')).toHaveTextContent('false');
    });
  });

  it('treats the visitor as signed in when the server found a session cookie', async () => {
    render(
      <>
        <PresenceValue />
        <SessionCookiePresence hasSession={true} />
      </>
    );

    await waitFor(() => {
      expect(screen.getByTestId('session-presence')).toHaveTextContent('true');
    });
  });
});
