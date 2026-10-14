import { describe, expect, test } from 'vitest';

import { getSafeRedirect } from './redirect';

describe('getSafeRedirect', () => {
  test('allows a same-site path', () => {
    expect(getSafeRedirect('/talks')).toBe('/talks');
  });

  test('rejects a protocol-relative url', () => {
    expect(getSafeRedirect('//evil.com')).toBe('/account');
  });

  test('rejects a backslash open-redirect path', () => {
    expect(getSafeRedirect('/\\evil.com')).toBe('/account');
  });

  test('rejects a tab-normalized protocol-relative path', () => {
    expect(getSafeRedirect('/\t/evil.com')).toBe('/account');
  });

  test('rejects an absolute external url', () => {
    expect(getSafeRedirect('https://evil.com/phish')).toBe('/account');
  });

  test('falls back when the redirect is missing', () => {
    expect(getSafeRedirect(null)).toBe('/account');
    expect(getSafeRedirect('', '/login')).toBe('/login');
  });
});
