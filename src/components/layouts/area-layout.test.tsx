/// <reference types="vitest/globals" />

import type { AreaNavSections } from '@/components/area-nav';
import type { RenderOptions } from '@/test';

import { describe, expect, it, render, screen } from '@/test';

import { AreaLayout } from './area-layout';

const { usePathname } = vi.hoisted(() => ({
  usePathname: vi.fn(() => '/account'),
}));

vi.mock('next/navigation', () => ({
  usePathname,
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const SECTIONS: AreaNavSections = [
  {
    href: '/account',
    items: [{ href: '/account', icon: 'settings', label: 'Settings' }],
    label: 'Settings',
  },
  {
    href: '/account/favorites',
    items: [
      { href: '/account/favorites', icon: 'favorites', label: 'Favorites' },
      { href: '/account/finished', icon: 'finished', label: 'Finished' },
    ],
    label: 'Library',
  },
];

describe('AreaLayout', () => {
  function setup(pathname = '/account', options?: RenderOptions) {
    usePathname.mockReturnValue(pathname);

    return render(
      <AreaLayout label="Account" sections={SECTIONS}>
        <p>Page body</p>
      </AreaLayout>,
      options
    );
  }

  it('renders section tabs as links in order', () => {
    setup();

    expect(
      screen.getAllByRole('tab').map((tab) => tab.textContent?.trim())
    ).toEqual(['Settings', 'Library']);
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveAttribute(
      'href',
      '/account'
    );
    expect(screen.getByRole('tab', { name: 'Library' })).toHaveAttribute(
      'href',
      '/account/favorites'
    );
  });

  it('marks the matching section tab as selected', () => {
    setup('/account/finished');

    expect(screen.getByRole('tab', { name: 'Library' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveAttribute(
      'aria-selected',
      'false'
    );
  });

  it('shows the active section sub-nav and current page', () => {
    setup('/account/finished');

    const finishedLinks = screen.getAllByRole('link', { name: 'Finished' });

    expect(finishedLinks.length).toBeGreaterThan(0);
    expect(
      screen.getAllByRole('link', { name: 'Favorites' }).length
    ).toBeGreaterThan(0);

    for (const link of finishedLinks) {
      expect(link).toHaveAttribute('aria-current', 'page');
    }
  });

  it('hides the sub-nav when the active section has one page', () => {
    setup('/account');

    expect(
      screen.queryByRole('link', { name: 'Favorites' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('navigation', { name: 'Settings' })
    ).not.toBeInTheDocument();
    expect(screen.getByText('Page body')).toBeInTheDocument();
  });
});
