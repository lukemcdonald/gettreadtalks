import { describe, expect, it } from '@/test';

import { getSafeRedirect } from './redirect';

describe('getSafeRedirect', () => {
  it('allows a same-site path', () => {
    expect(getSafeRedirect('/talks')).toBe('/talks');
  });

  it('rejects a protocol-relative url', () => {
    expect(getSafeRedirect('//evil.com')).toBe('/account');
  });

  it('rejects a backslash open-redirect path', () => {
    expect(getSafeRedirect('/\\evil.com')).toBe('/account');
  });

  it('rejects a tab-normalized protocol-relative path', () => {
    expect(getSafeRedirect('/\t/evil.com')).toBe('/account');
  });

  it('rejects an absolute external url', () => {
    expect(getSafeRedirect('https://evil.com/phish')).toBe('/account');
  });

  it('falls back when the redirect is missing', () => {
    expect(getSafeRedirect(null)).toBe('/account');
    expect(getSafeRedirect('', '/login')).toBe('/login');
  });

  it('rejects paths that normalize to a protocol-relative url', () => {
    expect(getSafeRedirect('/.//evil.com')).toBe('/account');
    expect(getSafeRedirect('/login/..//evil.com')).toBe('/account');
    expect(getSafeRedirect('/login/..\\/\\evil.com')).toBe('/account');
    expect(getSafeRedirect('///evil.com')).toBe('/account');
  });

  it('keeps a site path with a query and the site root', () => {
    expect(getSafeRedirect('/talks?topic=grace#start')).toBe(
      '/talks?topic=grace#start'
    );
    expect(getSafeRedirect('/', '/account')).toBe('/');
  });
});
