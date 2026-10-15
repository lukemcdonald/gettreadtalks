/// <reference types="vitest/globals" />

import type { AuthUser } from '@/services/auth/types';
import type { RenderOptions } from '@/test';

import { useCurrentUser } from '@/features/users/hooks/use-current-user';
import { describe, expect, it, render, screen } from '@/test';

import { AreaSwitcher } from './area-switcher';

vi.mock('@/features/users/hooks/use-current-user', () => ({
  useCurrentUser: vi.fn(),
}));

const { usePathname } = vi.hoisted(() => ({
  usePathname: vi.fn(() => '/account'),
}));

vi.mock('next/navigation', () => ({
  usePathname,
}));

describe('AreaSwitcher', () => {
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

    return render(<AreaSwitcher />, options);
  }

  it('shows Account and Manage for admins', () => {
    setup(createUser('admin'));

    expect(screen.getByRole('link', { name: 'Account' })).toHaveAttribute(
      'href',
      '/account'
    );
    expect(screen.getByRole('link', { name: 'Manage' })).toHaveAttribute(
      'href',
      '/manage'
    );
  });

  it('hides the switcher for non-admins', () => {
    setup(createUser('user'));

    expect(
      screen.queryByRole('navigation', { name: 'Areas' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Manage' })
    ).not.toBeInTheDocument();
  });
});
