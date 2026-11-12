import { describe, expect, it } from '@/test';

import { hasSessionCookieHeader } from './session-cookie';

describe('hasSessionCookieHeader', () => {
  it('is false when there is no cookie header', () => {
    expect(hasSessionCookieHeader(undefined)).toBe(false);
    expect(hasSessionCookieHeader(null)).toBe(false);
    expect(hasSessionCookieHeader('')).toBe(false);
  });

  it('is false when only unrelated cookies are present', () => {
    expect(hasSessionCookieHeader('theme=dark; sidebar=open')).toBe(false);
  });

  it('is true when the Better Auth session cookie is present', () => {
    expect(
      hasSessionCookieHeader('better-auth.session_token=user-session')
    ).toBe(true);
  });

  it('is true when the secure Better Auth session cookie is present', () => {
    expect(
      hasSessionCookieHeader(
        'theme=dark; __Secure-better-auth.session_token=user-session'
      )
    ).toBe(true);
  });
});
