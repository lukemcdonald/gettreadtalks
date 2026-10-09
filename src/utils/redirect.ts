/**
 * Returns the redirect param if it is a relative path, otherwise the fallback.
 */
export function getSafeRedirect(param: string | null, fallback = '/account') {
  if (
    param?.startsWith('/') &&
    !param.startsWith('//') &&
    !param.includes('\\')
  ) {
    return param;
  }

  return fallback;
}
