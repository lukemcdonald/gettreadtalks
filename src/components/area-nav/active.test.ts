import { describe, expect, it } from '@/test';

import { isAreaNavItemActive } from './active';

const transcripts = {
  href: '/manage/talks/transcripts',
};

const talks = {
  children: [transcripts],
  href: '/manage/talks',
};

describe('isAreaNavItemActive', () => {
  it('is active on its own route', () => {
    expect(isAreaNavItemActive(talks, '/manage/talks')).toBe(true);
  });

  it('keeps the parent active when a nested item is current', () => {
    expect(isAreaNavItemActive(talks, '/manage/talks/transcripts')).toBe(true);
    expect(isAreaNavItemActive(transcripts, '/manage/talks/transcripts')).toBe(
      true
    );
  });

  it('does not mark a nested item active on the parent route', () => {
    expect(isAreaNavItemActive(transcripts, '/manage/talks')).toBe(false);
  });

  it('does not treat an undeclared nested route as active', () => {
    expect(isAreaNavItemActive(talks, '/manage/talks/edit')).toBe(false);
    expect(
      isAreaNavItemActive({ href: '/account' }, '/account/favorites')
    ).toBe(false);
  });
});
