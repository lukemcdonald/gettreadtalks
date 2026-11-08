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

  const TALKS_ITEMS: AreaNavItem[] = [
    {
      children: [
        {
          href: '/manage/talks/studies',
          icon: 'studies',
          label: 'Studies',
        },
        {
          href: '/manage/talks/transcripts',
          icon: 'transcripts',
          label: 'Transcripts',
        },
      ],
      href: '/manage/talks',
      icon: 'talks',
      label: 'Talks',
    },
    { href: '/manage/clips', icon: 'clips', label: 'Clips' },
  ];

  it('lists nested destinations as individual sidebar items', () => {
    usePathname.mockReturnValue('/manage/talks/studies');

    render(<AreaNav items={TALKS_ITEMS} label="Content" variant="sidebar" />);

    expect(screen.getByTestId('nav-manage-talks-studies')).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(screen.getByTestId('nav-manage-talks')).not.toHaveAttribute(
      'aria-current'
    );
    expect(screen.getByTestId('nav-manage-talks-transcripts')).toBeVisible();
    expect(screen.getByTestId('nav-manage-clips')).toBeVisible();
  });

  it('labels the Talks menu with the current destination', () => {
    usePathname.mockReturnValue('/manage/talks');

    render(<AreaNav items={TALKS_ITEMS} label="Content" variant="tabs" />);

    expect(screen.getByTestId('nav-manage-talks-menu')).toHaveTextContent(
      'Talks'
    );
  });

  it('groups nested destinations under a Talks menu on tabs', async () => {
    usePathname.mockReturnValue('/manage/talks/studies');

    const { click } = render(
      <AreaNav items={TALKS_ITEMS} label="Content" variant="tabs" />
    );

    expect(screen.getByTestId('nav-manage-talks-menu')).toHaveTextContent(
      'Studies'
    );
    expect(screen.getByTestId('nav-manage-clips')).toBeVisible();
    expect(
      screen.queryByTestId('nav-manage-talks-transcripts')
    ).not.toBeInTheDocument();

    await click(screen.getByTestId('nav-manage-talks-menu'));

    expect(screen.getByTestId('nav-manage-talks-studies')).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(screen.getByTestId('nav-manage-talks')).not.toHaveAttribute(
      'aria-current'
    );
    expect(screen.getByTestId('nav-manage-talks-transcripts')).toBeVisible();
  });
});
