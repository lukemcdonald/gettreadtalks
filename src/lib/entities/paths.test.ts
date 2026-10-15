import { describe, expect, it } from 'vitest';

import {
  getAdminListPath,
  getAdminLoginRedirect,
  getEntityEditPath,
  getEntityNewPath,
  getPublicEditPath,
} from './paths';

describe('getAdminListPath', () => {
  it('returns the account admin page', () => {
    expect(getAdminListPath('talks')).toBe('/account/talks');
  });
});

describe('getEntityEditPath', () => {
  it('matches the intercepted admin sheet url', () => {
    expect(getEntityEditPath('talks', 'talk123')).toBe('/talks/edit/talk123');
  });

  it('prefills archived status', () => {
    expect(getEntityEditPath('talks', 'talk123', { status: 'archived' })).toBe(
      '/talks/edit/talk123?status=archived'
    );
  });
});

describe('getEntityNewPath', () => {
  it('matches the intercepted admin sheet url', () => {
    expect(getEntityNewPath('clips')).toBe('/clips/new');
  });
});

describe('getPublicEditPath', () => {
  it('appends /edit to a public detail path', () => {
    expect(getPublicEditPath('/talks/john-piper/justification')).toBe(
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
