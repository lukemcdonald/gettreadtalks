/**
 * Returns the redirect param if it stays same-origin, otherwise the fallback.
 */
export function getSafeRedirect(param: string | null, fallback = '/account') {
  if (!param?.startsWith('/')) {
    return fallback;
  }

  try {
    const url = new URL(param, 'http://localhost');
    if (url.origin !== 'http://localhost') {
      return fallback;
    }

    return url.pathname + url.search + url.hash;
  } catch {
    return fallback;
  }
}
