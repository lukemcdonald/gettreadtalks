/// <reference types="vitest/globals" />

import type { AuthUser } from '@/services/auth/types';
import type { RenderOptions } from '@/test';

import { useCurrentUser } from '@/features/users/hooks/use-current-user';
import { describe, expect, it, render, screen } from '@/test';

import { MobileNav } from './mobile-nav';

vi.mock('@/features/users/hooks/use-current-user', () => ({
  useCurrentUser: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}));

describe('MobileNav', () => {
  function createUser(role: AuthUser['role']): AuthUser {
    return {
      email: 'user@example.com',
      image: null,
      name: 'Test User',
      role,
    } as AuthUser;
  }

  function setup(user: AuthUser, options?: RenderOptions) {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: user,
      isLoading: false,
    });

    return render(<MobileNav />, options);
  }

  it('shows Manage for admins', async () => {
    const { click } = setup(createUser('admin'));

    await click(screen.getByRole('button', { name: 'Open navigation menu' }));

    expect(screen.getByRole('button', { name: 'Manage' })).toHaveAttribute(
      'href',
      '/manage'
    );
  });

  it('hides Manage for non-admins', async () => {
    const { click } = setup(createUser('user'));

    await click(screen.getByRole('button', { name: 'Open navigation menu' }));

    expect(
      screen.queryByRole('button', { name: 'Manage' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Test User' })).toHaveAttribute(
      'href',
      '/account'
    );
  });
});
