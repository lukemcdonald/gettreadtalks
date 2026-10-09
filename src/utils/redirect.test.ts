import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { getSafeRedirect } from './redirect.ts';

describe('getSafeRedirect', () => {
  test('allows a same-site path', () => {
    assert.equal(getSafeRedirect('/talks'), '/talks');
  });

  test('rejects a protocol-relative url', () => {
    assert.equal(getSafeRedirect('//evil.com'), '/account');
  });

  test('rejects a backslash open-redirect path', () => {
    assert.equal(getSafeRedirect('/\\evil.com'), '/account');
  });

  test('rejects a tab-normalized protocol-relative path', () => {
    assert.equal(getSafeRedirect('/\t/evil.com'), '/account');
  });

  test('rejects an absolute external url', () => {
    assert.equal(getSafeRedirect('https://evil.com/phish'), '/account');
  });

  test('falls back when the redirect is missing', () => {
    assert.equal(getSafeRedirect(null), '/account');
    assert.equal(getSafeRedirect('', '/login'), '/login');
  });
});
