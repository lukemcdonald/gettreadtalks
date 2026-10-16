/// <reference types="vitest/globals" />

import { describe, expect, it } from '@/test';

import { getActiveSection } from './get-active-section';
import { AREA_NAV } from './sections';

describe('getActiveSection', () => {
  it('returns the section whose item matches the pathname', () => {
    expect(getActiveSection(AREA_NAV, '/account/finished').label).toBe(
      'Content'
    );
  });

  it('does not treat a shorter parent path as the match', () => {
    expect(getActiveSection(AREA_NAV, '/account/favorites').label).toBe(
      'Content'
    );
  });

  it('matches a nested route under an item', () => {
    expect(getActiveSection(AREA_NAV, '/manage/talks/extra').label).toBe(
      'Manage'
    );
  });

  it('falls back to the first section when nothing matches', () => {
    expect(getActiveSection(AREA_NAV, '/unknown').label).toBe('Settings');
  });

  it('selects the exact settings path over nested content routes', () => {
    expect(getActiveSection(AREA_NAV, '/account').label).toBe('Settings');
  });

  it('selects Manage for the manage index path', () => {
    expect(getActiveSection(AREA_NAV, '/manage').label).toBe('Manage');
  });
});
