import { getSessionCookie } from 'better-auth/cookies';

export function hasSessionCookieHeader(
  cookieHeader: string | null | undefined
) {
  if (!cookieHeader) {
    return false;
  }

  return Boolean(getSessionCookie(new Headers({ cookie: cookieHeader })));
}
