import { describe, expect, it } from '@/test';

import { buildEntityEditPath, buildPathQuery, getLoginRedirect } from './paths';

describe('buildPathQuery', () => {
  it('returns an empty string when there is nothing to serialize', () => {
    expect(buildPathQuery()).toBe('');
    expect(buildPathQuery({})).toBe('');
    expect(buildPathQuery({ featured: undefined })).toBe('');
  });

  it('serializes defined values with sorted keys', () => {
    expect(buildPathQuery({ featured: true })).toBe('?featured=true');
    expect(buildPathQuery({ featured: true, sort: 'featured' })).toBe(
      '?featured=true&sort=featured'
    );
  });
});

describe('buildEntityEditPath', () => {
  it('prefills archived status', () => {
    expect(
      buildEntityEditPath('talks', 'talk123', { status: 'archived' })
    ).toBe('/talks/edit/talk123?status=archived');
  });
});

describe('getLoginRedirect', () => {
  it('keeps nested query params on the original url', () => {
    expect(getLoginRedirect('/talks/edit/talk123?status=archived')).toBe(
      '/login?redirect=%2Ftalks%2Fedit%2Ftalk123%3Fstatus%3Darchived'
    );
  });
});
