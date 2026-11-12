/// <reference types="vitest/globals" />

import type { RenderOptions } from '@/test';

import { describe, expect, it, render, screen } from '@/test';

import { AreaLayout } from './area-layout';

const { useIsAdmin, usePathname } = vi.hoisted(() => ({
  useIsAdmin: vi.fn(() => false),
  usePathname: vi.fn(() => '/account'),
}));

vi.mock('@/features/users/hooks/use-is-admin', () => ({
  useIsAdmin,
}));

vi.mock('next/navigation', () => ({
  usePathname,
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('AreaLayout', () => {
  function setup(
    pathname = '/account',
    isAdmin = false,
    options?: RenderOptions
  ) {
    useIsAdmin.mockReturnValue(isAdmin);
    usePathname.mockReturnValue(pathname);

    return render(
      <AreaLayout>
        <p>Page body</p>
      </AreaLayout>,
      options
    );
  }

  it('renders the Account tab for members', () => {
    setup();

    expect(
      screen.getAllByRole('tab').map((tab) => tab.textContent?.trim())
    ).toEqual(['Account']);
    expect(
      screen.queryByRole('tab', { name: 'Content' })
    ).not.toBeInTheDocument();
    expect(
      screen.getAllByRole('link', { name: 'Settings' }).length
    ).toBeGreaterThan(0);
  });

  it('shows the Content tab for admins', () => {
    setup('/account', true);

    expect(
      screen.getAllByRole('tab').map((tab) => tab.textContent?.trim())
    ).toEqual(['Account', 'Content']);
    expect(screen.getByRole('tab', { name: 'Content' })).toHaveAttribute(
      'href',
      '/manage/talks'
    );
  });

  it('selects Content on manage routes', () => {
    setup('/manage/talks');

    expect(screen.getByRole('tab', { name: 'Content' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
  });
});
