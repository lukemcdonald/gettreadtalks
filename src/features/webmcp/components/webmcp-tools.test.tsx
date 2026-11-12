/// <reference types="vitest/globals" />

import type { AuthUser } from '@/services/auth/types';

import { useCurrentUser } from '@/features/users/hooks/use-current-user';
import { describe, expect, it, render, waitFor } from '@/test';

import { WebMcpTools } from './webmcp-tools';

const { convex, router } = vi.hoisted(() => ({
  convex: {
    mutation: vi.fn(),
    query: vi.fn(),
  },
  router: {
    prefetch: vi.fn(),
    push: vi.fn(),
  },
}));

vi.mock('convex/react', () => ({
  useConvex: () => convex,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => router,
}));

vi.mock('@/features/users/hooks/use-current-user', () => ({
  useCurrentUser: vi.fn(),
}));

vi.mock('@/features/users/actions/revalidate-user-lists', () => ({
  revalidateUserLists: vi.fn(),
}));

const signedInUser = {
  email: 'user@example.com',
} as AuthUser;

describe('WebMcpTools', () => {
  const registrations: { name: string; signal: AbortSignal }[] = [];

  beforeAll(async () => {
    await import('@/features/webmcp/tools');
  });

  function registeredNames() {
    return registrations.map((entry) => entry.name);
  }

  beforeEach(() => {
    registrations.length = 0;

    const registerTool = vi.fn(
      (tool: { name: string }, options: { signal: AbortSignal }) => {
        registrations.push({
          name: tool.name,
          signal: options.signal,
        });

        return Promise.resolve();
      }
    );

    Object.defineProperty(document, 'modelContext', {
      configurable: true,
      value: { registerTool },
    });
  });

  afterEach(() => {
    Reflect.deleteProperty(document, 'modelContext');
  });

  function setUser(user: AuthUser | null) {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: user,
      isLoading: false,
    });
  }

  it('registers favorite and finished tools only while signed in', async () => {
    setUser(null);
    const view = render(<WebMcpTools />);

    await waitFor(
      () => {
        expect(registeredNames()).toEqual(['search_talks', 'open_talk']);
      },
      { timeout: 5000 }
    );

    setUser(signedInUser);
    view.rerender(<WebMcpTools />);

    await waitFor(
      () => {
        expect(registeredNames()).toEqual([
          'search_talks',
          'open_talk',
          'set_favorite',
          'set_finished',
        ]);
      },
      { timeout: 5000 }
    );

    const signedInTools = registrations.filter(
      (entry) => entry.name === 'set_favorite' || entry.name === 'set_finished'
    );

    setUser(null);
    view.rerender(<WebMcpTools />);

    await waitFor(
      () => {
        expect(signedInTools.every((entry) => entry.signal.aborted)).toBe(true);
      },
      { timeout: 5000 }
    );
    expect(registeredNames()).toEqual([
      'search_talks',
      'open_talk',
      'set_favorite',
      'set_finished',
    ]);
    expect(
      registrations
        .filter(
          (entry) => entry.name === 'search_talks' || entry.name === 'open_talk'
        )
        .every((entry) => !entry.signal.aborted)
    ).toBe(true);
  });
});
