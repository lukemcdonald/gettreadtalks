import { describe, expect, it } from 'vitest';

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
});
