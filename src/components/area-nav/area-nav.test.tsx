/// <reference types="vitest/globals" />

import type { AreaNavItem } from './area-nav';
import type { RenderOptions } from '@/test';

import { describe, expect, it, render, screen } from '@/test';

import { AreaNav } from './area-nav';

const { usePathname } = vi.hoisted(() => ({
  usePathname: vi.fn(() => '/account'),
}));

vi.mock('next/navigation', () => ({
  usePathname,
}));

describe('AreaNav', () => {
  const ITEMS: AreaNavItem[] = [
    { href: '/account', icon: 'settings', label: 'Settings' },
    { href: '/account/favorites', icon: 'favorites', label: 'Favorites' },
    { href: '/account/finished', icon: 'finished', label: 'Finished' },
  ];

  function setup(
    pathname = '/account',
    variant: 'sidebar' | 'tabs' = 'tabs',
    options?: RenderOptions
  ) {
    usePathname.mockReturnValue(pathname);

    return render(
      <AreaNav items={ITEMS} label="Account" variant={variant} />,
      options
    );
  }

  describe.each(['sidebar', 'tabs'] as const)('variant %s', (variant) => {
    it('renders items in the given order', () => {
      setup('/account', variant);

      expect(
        screen.getAllByRole('link').map((link) => link.textContent?.trim())
      ).toEqual(['Settings', 'Favorites', 'Finished']);
    });

    it('marks the matching item as the current page', () => {
      setup('/account/finished', variant);

      expect(screen.getByRole('link', { name: 'Finished' })).toHaveAttribute(
        'aria-current',
        'page'
      );
      expect(
        screen.getByRole('link', { name: 'Favorites' })
      ).not.toHaveAttribute('aria-current');
      expect(
        screen.getByRole('link', { name: 'Settings' })
      ).not.toHaveAttribute('aria-current');
    });

    it('does not treat a parent path as active on a nested route', () => {
      setup('/account/favorites', variant);

      expect(screen.getByRole('link', { name: 'Favorites' })).toHaveAttribute(
        'aria-current',
        'page'
      );
      expect(
        screen.getByRole('link', { name: 'Settings' })
      ).not.toHaveAttribute('aria-current');
    });
  });
});
