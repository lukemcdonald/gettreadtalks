import { describe, expect, it } from '@/test';

import {
  buildAdminListPath,
  buildEntityEditPath,
  buildEntityNewPath,
  buildPublicEditPath,
  getAdminLoginRedirect,
} from './paths';

describe('buildAdminListPath', () => {
  it('returns the manage admin page', () => {
    expect(buildAdminListPath('talks')).toBe('/manage/talks');
  });
});

describe('buildEntityEditPath', () => {
  it('matches the intercepted admin sheet url', () => {
    expect(buildEntityEditPath('talks', 'talk123')).toBe('/talks/edit/talk123');
  });

  it('prefills archived status', () => {
    expect(
      buildEntityEditPath('talks', 'talk123', { status: 'archived' })
    ).toBe('/talks/edit/talk123?status=archived');
  });
});

describe('buildEntityNewPath', () => {
  it('matches the intercepted admin sheet url', () => {
    expect(buildEntityNewPath('clips')).toBe('/clips/new');
  });
});

describe('buildPublicEditPath', () => {
  it('appends /edit to a public detail path', () => {
    expect(buildPublicEditPath('/talks/john-piper/justification')).toBe(
      '/talks/john-piper/justification/edit'
    );
  });
});

describe('getAdminLoginRedirect', () => {
  it('keeps nested query params on the original url', () => {
    expect(getAdminLoginRedirect('/talks/edit/talk123?status=archived')).toBe(
      '/login?redirect=%2Ftalks%2Fedit%2Ftalk123%3Fstatus%3Darchived'
    );
  });
});
