import { getSessionCookie } from 'better-auth/cookies';

export function hasSessionCookieHeader(
  cookieHeader: string | null | undefined
) {
  if (!cookieHeader) {
    return false;
  }

  return Boolean(getSessionCookie(new Headers({ cookie: cookieHeader })));
}

export function isAnonymousAuthSessionProbe(
  url: string,
  sessionCookiePresence: boolean | null
) {
  if (sessionCookiePresence === true) {
    return false;
  }

  return url.includes('/convex/token') || url.includes('/get-session');
}
