const SAFE_REDIRECT_PATH = /^\/(?![/\\])/u;

/**
 * Returns the redirect param if it stays on this site, otherwise the fallback.
 * The path must be one leading slash that is not followed by `/` or `\`.
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

    const path = `${url.pathname}${url.search}${url.hash}`;

    if (!SAFE_REDIRECT_PATH.test(path)) {
      return fallback;
    }

    return path;
  } catch {
    return fallback;
  }
}
