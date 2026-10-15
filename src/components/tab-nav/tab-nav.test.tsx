/// <reference types="vitest/globals" />

import type { RenderOptions } from '@/test';

import { describe, expect, it, render, screen } from '@/test';

import { TabNav } from './tab-nav';

const { usePathname } = vi.hoisted(() => ({
  usePathname: vi.fn(() => '/account/favorites'),
}));

vi.mock('next/navigation', () => ({
  usePathname,
}));

describe('TabNav', () => {
  const ITEMS = [
    { href: '/account/favorites', label: 'Favorites' },
    { href: '/account/finished', label: 'Finished' },
    { href: '/account', label: 'Settings' },
  ];

  function setup(pathname = '/account/favorites', options?: RenderOptions) {
    usePathname.mockReturnValue(pathname);

    return render(<TabNav items={ITEMS} label="Account" />, options);
  }

  it('marks the matching tab as the current page', () => {
    setup('/account/finished');

    expect(screen.getByRole('link', { name: 'Finished' })).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(screen.getByRole('link', { name: 'Favorites' })).not.toHaveAttribute(
      'aria-current'
    );
    expect(screen.getByRole('link', { name: 'Settings' })).not.toHaveAttribute(
      'aria-current'
    );
  });

  it('does not treat a parent path as active on a nested route', () => {
    setup('/account/favorites');

    expect(screen.getByRole('link', { name: 'Favorites' })).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(screen.getByRole('link', { name: 'Settings' })).not.toHaveAttribute(
      'aria-current'
    );
  });
});
