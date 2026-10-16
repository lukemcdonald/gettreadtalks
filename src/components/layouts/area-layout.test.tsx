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

  it('renders Settings and Content tabs for members', () => {
    setup();

    expect(
      screen.getAllByRole('tab').map((tab) => tab.textContent?.trim())
    ).toEqual(['Settings', 'Content']);
    expect(
      screen.queryByRole('tab', { name: 'Manage' })
    ).not.toBeInTheDocument();
  });

  it('shows the Manage tab for admins', () => {
    setup('/account', true);

    expect(
      screen.getAllByRole('tab').map((tab) => tab.textContent?.trim())
    ).toEqual(['Settings', 'Content', 'Manage']);
    expect(screen.getByRole('tab', { name: 'Manage' })).toHaveAttribute(
      'href',
      '/manage/talks'
    );
  });

  it('shows the Manage tab on manage routes', () => {
    setup('/manage/talks');

    expect(screen.getByRole('tab', { name: 'Manage' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
  });

  it('keeps the Settings sub-nav so the content column stays put', () => {
    setup('/account');

    const settingsLinks = screen.getAllByRole('link', { name: 'Settings' });

    expect(settingsLinks.length).toBeGreaterThan(0);
    expect(
      screen.getAllByRole('navigation', { name: 'Settings' }).length
    ).toBeGreaterThan(0);
    expect(screen.getByText('Page body')).toBeInTheDocument();
  });

  it('marks the matching content item as the current page', () => {
    setup('/account/finished');

    expect(screen.getByRole('tab', { name: 'Content' })).toHaveAttribute(
      'aria-selected',
      'true'
    );

    for (const link of screen.getAllByRole('link', { name: 'Finished' })) {
      expect(link).toHaveAttribute('aria-current', 'page');
    }
  });

  it('lists every manage entity in one sub-nav', () => {
    setup('/manage/speakers', true);

    expect(
      screen.getAllByRole('link', { name: 'Talks' }).length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole('link', { name: 'Collections' }).length
    ).toBeGreaterThan(0);

    for (const link of screen.getAllByRole('link', { name: 'Speakers' })) {
      expect(link).toHaveAttribute('aria-current', 'page');
    }
  });
});
