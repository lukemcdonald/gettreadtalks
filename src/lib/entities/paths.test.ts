import { describe, expect, it } from '@/test';

import { buildEntityEditPath, getAdminLoginRedirect } from './paths';

describe('buildEntityEditPath', () => {
  it('prefills archived status', () => {
    expect(
      buildEntityEditPath('talks', 'talk123', { status: 'archived' })
    ).toBe('/talks/edit/talk123?status=archived');
  });
});

describe('getAdminLoginRedirect', () => {
  it('keeps nested query params on the original url', () => {
    expect(getAdminLoginRedirect('/talks/edit/talk123?status=archived')).toBe(
      '/login?redirect=%2Ftalks%2Fedit%2Ftalk123%3Fstatus%3Darchived'
    );
  });
});
