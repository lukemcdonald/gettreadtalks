/// <reference types="vitest/globals" />

import type { AuthUser } from '@/services/auth/types';

import { api } from '@/convex/_generated/api';
import { useCurrentUser } from '@/features/users/hooks/use-current-user';
import { describe, expect, it, render, screen } from '@/test';

const { useConvexAuth, useQuery } = vi.hoisted(() => ({
  useConvexAuth: vi.fn(),
  useQuery: vi.fn(),
}));

vi.mock('convex/react', () => ({
  useConvexAuth,
  useQuery,
}));

function CurrentUserStatus({ initialData }: { initialData?: AuthUser | null }) {
  const { data, isLoading } = useCurrentUser(initialData);

  return (
    <p data-testid="current-user-status">
      {isLoading ? 'loading' : (data?.name ?? 'signed-out')}
    </p>
  );
}

describe('useCurrentUser', () => {
  const signedInUser = {
    email: 'user@example.com',
    name: 'Test User',
  } as AuthUser;

  function mockAuth({
    isAuthenticated,
    isLoading,
  }: {
    isAuthenticated: boolean;
    isLoading: boolean;
  }) {
    useConvexAuth.mockReturnValue({
      isAuthenticated,
      isLoading,
    });
  }

  it('skips getCurrentUser when signed out', () => {
    mockAuth({ isAuthenticated: false, isLoading: false });
    useQuery.mockReturnValue(undefined);

    render(<CurrentUserStatus />);

    expect(screen.getByTestId('current-user-status')).toHaveTextContent(
      'signed-out'
    );
    expect(useQuery).toHaveBeenCalledWith(api.users.getCurrentUser, 'skip');
  });

  it('queries getCurrentUser when signed in', () => {
    mockAuth({ isAuthenticated: true, isLoading: false });
    useQuery.mockReturnValue(signedInUser);

    render(<CurrentUserStatus />);

    expect(screen.getByTestId('current-user-status')).toHaveTextContent(
      signedInUser.name
    );
    expect(useQuery).toHaveBeenCalledWith(api.users.getCurrentUser, {});
  });

  it('trusts SSR initialData while auth is loading', () => {
    mockAuth({ isAuthenticated: false, isLoading: true });
    useQuery.mockReturnValue(undefined);

    render(<CurrentUserStatus initialData={signedInUser} />);

    expect(screen.getByTestId('current-user-status')).toHaveTextContent(
      signedInUser.name
    );
  });
});
