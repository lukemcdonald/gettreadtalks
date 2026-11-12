/// <reference types="vitest/globals" />

import type { AuthUser } from '@/services/auth/types';
import type { RenderOptions } from '@/test';

import { useCurrentUser } from '@/features/users/hooks/use-current-user';
import { describe, expect, it, render, screen } from '@/test';

import { AccountMenu } from './account-menu';

vi.mock('@/features/users/hooks/use-current-user', () => ({
  useCurrentUser: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}));

describe('AccountMenu', () => {
  function createUser(role: AuthUser['role']): AuthUser {
    return {
      email: 'user@example.com',
      image: null,
      name: 'Test User',
      role,
    } as AuthUser;
  }

  function setup(user: AuthUser | null, options?: RenderOptions) {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: user,
      isLoading: false,
    });

    return render(<AccountMenu initialUser={user} />, options);
  }

  it('shows Sign In when signed out', () => {
    setup(null);

    const signInLinks = screen.getAllByRole('link', { name: 'Sign In' });

    expect(signInLinks.length).toBeGreaterThan(0);
    expect(signInLinks[0]).toHaveAttribute('href', '/login');
  });

  it('shows account destinations for signed-in users', async () => {
    const { click } = setup(createUser('user'));

    await click(screen.getByTestId('account-menu'));

    expect(screen.getByText('user@example.com')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Favorites' })).toHaveAttribute(
      'href',
      '/account/favorites'
    );
    expect(screen.getByRole('menuitem', { name: 'Finished' })).toHaveAttribute(
      'href',
      '/account/finished'
    );
    expect(screen.getByRole('menuitem', { name: 'Settings' })).toHaveAttribute(
      'href',
      '/account'
    );
    expect(screen.getByRole('menuitem', { name: 'Sign out' })).toHaveAttribute(
      'href',
      '/logout'
    );
    expect(
      screen.queryByRole('menuitem', { name: 'Content' })
    ).not.toBeInTheDocument();
  });

  it('shows Content for admins', async () => {
    const { click } = setup(createUser('admin'));

    await click(screen.getByTestId('account-menu'));

    expect(screen.getByRole('menuitem', { name: 'Content' })).toHaveAttribute(
      'href',
      '/manage/talks'
    );
  });
});
