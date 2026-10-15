/// <reference types="vitest/globals" />

import type { RenderOptions } from '@/test';

import { describe, expect, it, render, screen } from '@/test';

import { AreaNav } from './area-nav';

const { usePathname } = vi.hoisted(() => ({
  usePathname: vi.fn(() => '/account/favorites'),
}));

vi.mock('next/navigation', () => ({
  usePathname,
}));

describe('AreaNav', () => {
  const ITEMS = [
    { href: '/account/favorites', label: 'Favorites' },
    { href: '/account/finished', label: 'Finished' },
    { href: '/account', label: 'Settings' },
  ];

  function setup(
    pathname = '/account/favorites',
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
