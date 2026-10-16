/// <reference types="vitest/globals" />

import { describe, expect, it } from '@/test';

import { AREA_NAV, getActiveSection, getVisibleSections } from './sections';

describe('getVisibleSections', () => {
  it('hides Content until asked', () => {
    expect(getVisibleSections(false).map((section) => section.label)).toEqual([
      'Account',
    ]);
  });

  it('includes Content for admins', () => {
    expect(getVisibleSections(true).map((section) => section.label)).toEqual([
      'Account',
      'Content',
    ]);
  });
});

describe('getActiveSection', () => {
  it('selects Account on account paths', () => {
    expect(getActiveSection(AREA_NAV, '/account/favorites').label).toBe(
      'Account'
    );
  });

  it('selects Content on manage paths', () => {
    expect(getActiveSection(AREA_NAV, '/manage').label).toBe('Content');
  });
});
