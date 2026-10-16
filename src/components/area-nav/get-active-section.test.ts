/// <reference types="vitest/globals" />

import type { AreaNavSections } from './area-nav';

import { describe, expect, it } from '@/test';

import { getActiveSection } from './get-active-section';

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

describe('getActiveSection', () => {
  it('returns the section whose item matches the pathname', () => {
    expect(getActiveSection(SECTIONS, '/account/finished').label).toBe(
      'Library'
    );
  });

  it('does not treat a shorter parent path as the match', () => {
    expect(getActiveSection(SECTIONS, '/account/favorites').label).toBe(
      'Library'
    );
  });

  it('matches a nested route under an item', () => {
    expect(getActiveSection(SECTIONS, '/account/favorites/extra').label).toBe(
      'Library'
    );
  });

  it('falls back to the first section when nothing matches', () => {
    expect(getActiveSection(SECTIONS, '/unknown').label).toBe('Settings');
  });

  it('selects the exact settings path over nested library routes', () => {
    expect(getActiveSection(SECTIONS, '/account').label).toBe('Settings');
  });
});
