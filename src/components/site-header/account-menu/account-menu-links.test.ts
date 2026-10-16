/// <reference types="vitest/globals" />

import { describe, expect, it } from '@/test';

import { getAccountMenuLinks } from './account-menu-links';

describe('getAccountMenuLinks', () => {
  it('lists Account destinations in AREA_NAV order', () => {
    expect(
      getAccountMenuLinks(false).map((link) => [link.label, link.href])
    ).toEqual([
      ['Settings', '/account'],
      ['Favorites', '/account/favorites'],
      ['Finished', '/account/finished'],
    ]);
  });

  it('adds a single Content link for admins', () => {
    expect(
      getAccountMenuLinks(true).map((link) => [link.label, link.href])
    ).toEqual([
      ['Settings', '/account'],
      ['Favorites', '/account/favorites'],
      ['Finished', '/account/finished'],
      ['Content', '/manage/talks'],
    ]);
  });
});
