/// <reference types="vitest/globals" />

import type { AuthUser } from '@/services/auth/types';
import type { RenderOptions } from '@/test';

import { describe, expect, it, render, screen } from '@/test';

import { AccountMenu } from './account-menu';

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

  function setup(user: AuthUser, options?: RenderOptions) {
    return render(<AccountMenu initialUser={user} />, options);
  }

  it('shows account destinations for signed-in users', async () => {
    const { click } = setup(createUser('user'));

    await click(screen.getByTestId('account-menu'));

    expect(screen.getByText('Signed in as')).toBeInTheDocument();
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
  });

  it('shows Manage for admins', async () => {
    const { click } = setup(createUser('admin'));

    await click(screen.getByTestId('account-menu'));

    expect(screen.getByRole('menuitem', { name: 'Manage' })).toHaveAttribute(
      'href',
      '/manage'
    );
  });

  it('hides Manage for non-admins', async () => {
    const { click } = setup(createUser('user'));

    await click(screen.getByTestId('account-menu'));

    expect(
      screen.queryByRole('menuitem', { name: 'Manage' })
    ).not.toBeInTheDocument();
  });
});
