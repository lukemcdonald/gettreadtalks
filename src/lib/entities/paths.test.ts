import { describe, expect, test } from 'vitest';

import {
  getAdminListPath,
  getAdminLoginRedirect,
  getEntityEditPath,
  getEntityNewPath,
  getPublicEditPath,
} from './paths';

describe('getAdminListPath', () => {
  test('returns the account admin page', () => {
    expect(getAdminListPath('talks')).toBe('/account/talks');
  });
});

describe('getEntityEditPath', () => {
  test('matches the intercepted admin sheet url', () => {
    expect(getEntityEditPath('talks', 'talk123')).toBe('/talks/edit/talk123');
  });

  test('prefills archived status', () => {
    expect(getEntityEditPath('talks', 'talk123', { status: 'archived' })).toBe(
      '/talks/edit/talk123?status=archived'
    );
  });
});

describe('getEntityNewPath', () => {
  test('matches the intercepted admin sheet url', () => {
    expect(getEntityNewPath('clips')).toBe('/clips/new');
  });
});

describe('getPublicEditPath', () => {
  test('appends /edit to a public detail path', () => {
    expect(getPublicEditPath('/talks/john-piper/justification')).toBe(
      '/talks/john-piper/justification/edit'
    );
  });
});

describe('getAdminLoginRedirect', () => {
  test('keeps nested query params on the original url', () => {
    expect(getAdminLoginRedirect('/talks/edit/talk123?status=archived')).toBe(
      '/login?redirect=%2Ftalks%2Fedit%2Ftalk123%3Fstatus%3Darchived'
    );
  });
});
